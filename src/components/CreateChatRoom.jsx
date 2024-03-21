/* eslint-disable react/prop-types */
import {useEffect, useReducer, useRef, useState} from "react";
import "./CreateChatRoom.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { containsOffensiveWords } from "../utils/offensiveWordsChecker";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import {GeoPoint, addDoc, collection} from 'firebase/firestore';
import { UserContext } from "../App";
import { db } from "../firebaseAuth.js";
import mapboxgl from "mapbox-gl";
import {getMetersPerPixelAtLatitude} from "../utils/getMetersPerPixelAtLatitude.js";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const ChatRoom = () => {
  const { user, userLocation } = useContext(UserContext);
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [formData, setFormData] = useState({
    chatRoomName: "",
    createRoom: false,
    radius: 2,
  });

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 7,
    });

    map.current.on('load', () => {
      map.current.addSource("circleSource", {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [userLocation.longitude, userLocation.latitude],
            },
          }],
        },
      });

      map.current.addLayer({
        "id": "circleLayer",
        "type": "circle",
        "source": "circleSource",
        "paint": {
          "circle-radius": formData.radius,
          "circle-color": "#ff0000",
          "circle-opacity": 0.6,
        },
      });
      updateCircleRadius(formData.radius);
    });
  }, [userLocation.latitude, userLocation.longitude])

  useEffect(() => { // Update circle radius on form change
    if (map.current && map.current.isStyleLoaded()) {
      updateCircleRadius(formData.radius);
    }
  }, [formData.radius]);

  useEffect(() => { // Recalculate circle radius on zoom change
    const onZoomEnd = () => {
      if (map.current) updateCircleRadius(formData.radius);
    };

    map.current?.on('zoomend', onZoomEnd); // Add zoom event listener

    return () => { // Remove zoom event listener
      map.current?.off('zoomend', onZoomEnd);
    };
  }, [map.current, formData.radius])

  const updateCircleRadius = (radiusInKm) => { // Update circle radius on zoom change
    const radiusInMeters = radiusInKm * 1000;
    const zoom = map.current.getZoom();
    const metersPerPixel = getMetersPerPixelAtLatitude(userLocation.latitude, zoom);
    const radiusInPixels = radiusInMeters / metersPerPixel;
    map.current.setPaintProperty('circleLayer', 'circle-radius', radiusInPixels);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateChatRoom = async () => {
    const {chatRoomName, radius} = formData;

    if (containsOffensiveWords(chatRoomName)) {
      toast.error("Don't use bad words in chat room");
    } else if (chatRoomName.trim() === "") {
      toast.error("Chat room name cannot be empty");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        createRoom: true,
      }));
      const roomRef = collection(db, "rooms");
      const createdLocation = new GeoPoint(userLocation.latitude, userLocation.longitude);

      const docRef = await addDoc(roomRef, {
        name: chatRoomName,
        createdAt: new Date,
        createdBy: user.displayName,
        createdLocation: createdLocation,
        radius: radius
      });
      toast.success(`${chatRoomName} has been created`);
      navigate(`/joinroom/${docRef.id}`);
    }
  };
    return (
        <div className="chat-room">
          <h2>Create a New Chat Room</h2>
          <form>
            <div className="form-group">
              <label htmlFor="chatRoomName">Chat Room Name</label>
              <input
                  type="text"
                  id="chatRoomName"
                  name="chatRoomName"
                  placeholder="Enter chat room name"
                  value={formData.chatRoomName}
                  onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="radius">Radius (in km)</label>
              <input
                  type="range"
                  id="radius"
                  name="radius"
                  min="0"
                  max="1000"
                  value={formData.radius}
                  onChange={handleChange}
              />
              <p className="slider-value bold-text">Value: {formData.radius} km</p>
            </div>
            <button
                type="button"
                onClick={handleCreateChatRoom}
                className="bold-text"
            >
              Create Chat Room
            </button>
          </form>
          <div className="map-container" ref={mapContainer}>
          </div>
        </div>
    );
}
export default ChatRoom;
