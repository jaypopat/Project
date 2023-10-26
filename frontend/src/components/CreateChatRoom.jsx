/* eslint-disable react/prop-types */
import { useState } from "react";
import "./CreateChatRoom.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { containsOffensiveWords } from "../utils/offensiveWordsChecker";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const ChatRoom = ({ username }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    chatRoomName: "",
    createRoom: false,
    radius: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateChatRoom = () => {
    const { chatRoomName, radius } = formData;

    if (containsOffensiveWords(chatRoomName)) {
      toast.error("Don't use bad words in chat room");
    } else if (chatRoomName.trim() === "") {
      toast.error("Chat room name cannot be empty");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        createRoom: true,
      }));
      toast.success(`${chatRoomName} has been created`);
      let chatRoomID = uuidv4();
      console.log({ username, chatRoomName, chatRoomID, radius }); // Log the username

      // Send data to the server as a post request to be added to the database
      // If the response is OK, proceed; otherwise, throw an error
      navigate(`/joinroom/${chatRoomID}`);
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
            max="20"
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
    </div>
  );
};

export default ChatRoom;
