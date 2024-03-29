/* eslint-disable react/prop-types */
import { useEffect, useReducer, useRef, useState } from "react";
import "./CreateChatRoom.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { containsOffensiveWords } from "../utils/offensiveWordsChecker";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GeoPoint, addDoc, collection } from 'firebase/firestore';
import { UserContext } from "../App";
import { db } from "../firebaseAuth.js";
import mapboxgl from "mapbox-gl";
import MapComponent from "./Map.jsx";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

const ChatRoom = () => {
  const { user, userLocation } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    chatRoomName: "",
    createRoom: false,
    radius: 2,
  });

  const locations = [{
    longitude: userLocation.longitude,
    latitude: userLocation.latitude,
    radius: formData.radius,
  }];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateChatRoom = async () => {
    const { chatRoomName, radius } = formData;

    if (containsOffensiveWords(chatRoomName)) {
      toast.error("Don't use bad words in chat room");
    } else if (chatRoomName.trim() === "") {
      toast.error("Chat room name cannot be empty");
    } else if (chatRoomName.length > 20) {
      toast.error("Chat room name cannot be more than 20 chars");
    } else if (radius == 0) {
      toast.error("Radius cannot be 0");
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
    <div className="responsive-background">
      <div className="chat-room">
        <h2>Create a New Chat Room</h2>
        <form>
          <div className="form-group">
            <label htmlFor="chatRoomName">Chat Room Name</label>
            <input
              type="text"
              id="chatRoomName"
              name="chatRoomName"
              className="chatRoomInput"
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
            className="create-button"
            type="button"
            onClick={handleCreateChatRoom}
          >
            Create Room
          </button>
        </form>
        <div className="map-container">
          <MapComponent locations={locations} />
        </div>
      </div>
    </div>
  );
}
export default ChatRoom;
