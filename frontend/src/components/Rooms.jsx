import { useState, useEffect, useContext, useRef } from "react";
import "./Rooms.css";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { calculateDistance } from "../utils/calculateDistance";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = "pk.eyJ1IjoiamF5cDEiLCJhIjoiY2x0cTh4MWR0MDNsbTJpcGNpYWpvcWlsNSJ9.ebl8ozkVTD0hNk8mAKzDcQ";

const Rooms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMapBox, setShowMap] = useState(false); 
  const { userLocation } = useContext(UserContext);
  const [rooms, setRooms] = useState([]);

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const roomsRef = collection(db, "rooms");
    const queryRooms = query(roomsRef, orderBy("createdAt", "asc"));
    setIsLoading(true)
    const unsubscribe = onSnapshot(queryRooms, (snapshot) => {
      let filteredRooms = [];
      snapshot.forEach((doc) => {
        const roomData = { ...doc.data(), id: doc.id };
        if (userLocation && roomData.createdLocation) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            roomData.createdLocation.latitude,
            roomData.createdLocation.longitude
          );
          if (distance <= roomData.radius) {
            filteredRooms.push(roomData);
          }
        }
      });
      setIsLoading(false);
      setRooms(filteredRooms);
    });
    return () => unsubscribe();
  }, [userLocation]);

  const showMap = (centrePoint, radius) => {
    setShowMap(true);
    if (!map.current) {
       map.current = new mapboxgl.Map({
         container: mapContainer.current,
         style: 'mapbox://styles/mapbox/streets-v12',
         center: centrePoint,
         zoom: 12,
       });
   
       map.current.on('load', () => {
         // Add a GeoJSON source for the circle
         map.current.addSource("circleSource", {
           "type": "geojson",
           "data": {
             "type": "FeatureCollection",
             "features": [{
               "type": "Feature",
               "geometry": {
                 "type": "Point",
                 "coordinates": centrePoint
               }
             }]
           }
         });
   
         map.current.addLayer({
           "id": "circleLayer",
           "type": "circle",
           "source": "circleSource",
           "paint": {
             "circle-radius": radius*1000, // Specify the radius in meters
             "circle-color": "#ff0000", // Red color
             "circle-opacity": 0.6
           }
         });
       });
    } else {
       map.current.setCenter(centrePoint);
       map.current.setZoom(12);
    }
   }
   

  return isLoading ? <Spinner /> : (
    <div>
      <table id="rooms">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>
                <Link to={`/joinroom/${room.id}`}>
                  <button className="join-button">Join</button>
                </Link>
                <button onClick={() => showMap([room.createdLocation.latitude, room.createdLocation.longitude], room.radius)} className="join-button">View on Map</button>
              </td>
            </tr>
          ))}
          <tr>
          </tr>
        </tbody>
      </table>
      {showMap && <div ref={mapContainer} id="map" />}
    </div>
  );
};

export default Rooms;