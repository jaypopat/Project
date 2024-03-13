/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import "./Rooms.css";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { calculateDistance } from "../utils/calculateDistance"; // Ensure this matches your actual utility function name and path
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

const Rooms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userLocation } = useContext(UserContext);
  const [rooms, setRooms] = useState([]);
  const roomsRef = collection(db, "rooms");

  useEffect(() => {
    const queryRooms = query(roomsRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(queryRooms, (snapshot) => {
      let filteredRooms = [];
      snapshot.forEach((doc) => {
        const roomData = { ...doc.data(), id: doc.id };
        //console.log(roomData);
        if (userLocation && roomData.createdLocation) { // Ensure there's a check for roomData.createdLocation existence
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
      setRooms(filteredRooms);
    });
    return () => unsubscribe();
  }, [userLocation]);

  return isLoading ? (
      <Spinner />
  ) : error ? (
      <div id="error">{error}</div>
  ) : (
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
              </td>
            </tr>
        ))}
        </tbody>
      </table>
  );
};

export default Rooms;
