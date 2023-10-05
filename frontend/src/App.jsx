import { useEffect, useState } from "react";
import Header from "./components/Header";
import LandingButton from "./components/LandingButton";
import Footer from "./components/Footer";
import CreateChatRoom from "./components/CreateChatRoom";
import Rooms from "./components/Rooms";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gif from "./assets/Whisper1.gif";
import { containsOffensiveWords } from "./utils/offensiveWordsChecker";
import { calculateDistance } from "./utils/calculateDistance";
import { rooms } from "./roomsArr";
import "./App.css";


function App() {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameEntered, setUsernameEntered] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyRooms, setNearbyRooms] = useState([]);
  const [locationAccess, grantLocationAccess] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        grantLocationAccess(true);
      },
      (error) => {
        console.error("Error getting user location:", error);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    console.log(userLocation);
  }, [userLocation]);

  useEffect(() => {
    if (userLocation) {
      const newNearbyRooms = rooms.filter((room) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          room.location.latitude,
          room.location.longitude
        );
        return distance <= room.radius;
      });
      setNearbyRooms(newNearbyRooms);
    }
  }, [userLocation]);

  const handleCreateRoom = () => {
    setCreateRoom(true);
    setJoinRoom(false);
  };

  const handleJoinRoom = () => {
    setCreateRoom(false);
    setJoinRoom(true);
  };

  const handleReturnToLandingPage = () => {
    setCreateRoom(false);
    setJoinRoom(false);
    setUsernameEntered(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "" || username.length >= 20) {
      toast.error("Username needs to be between 1 and 20 characters");
    } else if (containsOffensiveWords(username)) {
      toast.error(
        "Username contains offensive words. Please choose a different one."
      );
    } else if (!locationAccess) {
      toast.error("Give access to location");
    } else {
      setUsernameEntered(true);
    }
  };

  return (
    <>
      <Header redirectHome={handleReturnToLandingPage} />

      {!createRoom && !joinRoom && !usernameEntered && (
        <>
          <img height="600px" width="600px" src={gif} alt="gif" />
          <form onSubmit={handleSubmit} className="username-input-container">
            <table id="usernameSubmit">
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="username-input"
                    />
                  </td>
                  <td>
                    <button type="submit" className="submit-button">
                      Submit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </>
      )}

      {!createRoom && !joinRoom && usernameEntered && (
        <>
          <LandingButton buttonText="Create Room" onClick={handleCreateRoom} />
          <LandingButton buttonText="Join Room" onClick={handleJoinRoom} />
        </>
      )}
      {usernameEntered && (
        <p className="username-display">Username: {username}</p>
      )}
      {createRoom && !joinRoom && usernameEntered && (
        <CreateChatRoom username={username} />
      )}

      {!createRoom && joinRoom && usernameEntered && (
        <Rooms nearbyRooms={nearbyRooms} />
      )}

      <Footer />
    </>
  );
}

export default App;
