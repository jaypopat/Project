import React, { useState, useEffect, useContext } from "react";
import "./SidebarRooms.css";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../App";
import { calculateDistance } from "../utils/calculateDistance";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseAuth.js";
import { useLocation } from 'react-router-dom';

const SidebarRooms = () => {
  const { userLocation } = useContext(UserContext);
  const [sidebarContent, setSidebarContent] = useState([]);
  const { id: currRoomID } = useParams();
  const location = useLocation();
  const isJoinRoom = location.pathname === '/joinroom';

  useEffect(() => {
    const roomsRef = collection(db, "rooms");
    const queryRooms = query(roomsRef, orderBy("createdAt", "asc"));

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
          if (distance <= roomData.radius && roomData.id !== currRoomID) {
            filteredRooms.push(roomData);
          }
        }
      });
      setSidebarContent(filteredRooms);
    });

    return () => unsubscribe();
  }, [userLocation, currRoomID]);

  return (
    <>
      {sidebarContent.length === 0 ? (
        <>
          <p>No rooms.. Create a Room</p>
          <Link to={"/createroom"}>
            <button className="create-room-button"> Create Room </button>
          </Link>
        </>
      ) : (
        <RoomTable rooms={sidebarContent} className={isJoinRoom ? "joinRoom" : ""} />
      )}
    </>
  );
}

const RoomTable = ({ rooms, className }) => (
  <div className={`sidebar-center-room-${className}`}>
    <table id="rooms">
      <thead>
        <tr>
          <th>Join another room!</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <RoomRow key={room.id} room={room} />
        ))}
        <tr></tr>
      </tbody>
    </table>
  </div>
);

const RoomRow = ({ room }) => (
  <tr key={room.id}>
    <td>{room.name}</td>
    <td>
      <Link className="join-button-container" to={`/joinroom/${room.id}`}>
        <button className="join-button">Join</button>
      </Link>
    </td>
  </tr>
);

export default SidebarRooms;