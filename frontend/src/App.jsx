/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateChatRoom from "./components/CreateChatRoom";
import JoinRoom from "./components/Rooms";
import Register from "./components/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import ProfilePage from "./components/ProfilePage";
import Protected from "./components/ProtectedRoute";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "./components/NotFound";
import Home from "./components/Home";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
export const UserContext = createContext();

const App = () => {
  const [userSet, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccess, grantLocationAccess] = useState(false);
  const [userLocationFetchingInBackground, setIsLoadingGeo] = useState(true);


  const user = "dwd ";

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
          grantLocationAccess(true);
        },
        (error) => {
          if (error.code == error.PERMISSION_DENIED)
            console.log("User denied the request for Geolocation.");
          else {
            console.log(error);
            reject(error);
          }
        },
        { enableHighAccuracy: true }
      );
    });
  };
  

  useEffect(() => {
    getLocation().then((location) => {
      setUserLocation(location);
      setIsLoadingGeo(false);
    }).catch((error) => {
      console.log(error);
      setIsLoadingGeo(false);
    });
  }, []);

  useEffect(() => {
    console.log(userLocation);
  }, [userLocation]);

  return (
    <UserContext.Provider value={{ userLocation, user,userLocationFetchingInBackground }}>
      <>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/profile"
            element={
              <Protected>
                <ProfilePage />
              </Protected>
            }
          />
          <Route
            path="/createroom"
            element={
              <Protected>
                <CreateChatRoom />
              </Protected>
            }
          />
          <Route
            path="/joinroom"
            element={
              <Protected>
                <JoinRoom />
              </Protected>
            }
          />
          <Route
            path="/joinroom/:id"
            element={
              <Protected>
                <ChatRoom />
              </Protected>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer/>
      </>
    </UserContext.Provider>
  );
};
export default App;
