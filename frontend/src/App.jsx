import { useState } from "react";
import Header from "./components/Header";
import LandingButton from "./components/LandingButton";
import Footer from "./components/Footer";
import CreateChatRoom from "./components/CreateChatRoom";
import Rooms from "./components/Rooms";
import "./App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gif from "./assets/Whisper1.gif";
import { containsOffensiveWords } from "./utils/offensiveWordsChecker";

function App() {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameEntered, setUsernameEntered] = useState(false);

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
    if (username.trim() === "") {
      toast.error("Username cannot be empty.");
    } else if (containsOffensiveWords(username)) {
      toast.error(
        "Username contains offensive words. Please choose a different one."
      );
    } else {
      setUsernameEntered(true);
    }
  };

  return (
    <>
      <Header redirectHome={handleReturnToLandingPage} />
      {createRoom && <CreateChatRoom username={username} />}
      {joinRoom && <Rooms />}

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

      <Footer />
    </>
  );
}

export default App;
