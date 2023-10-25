/* eslint-disable no-unused-vars */
// App.js
import { useState, useEffect, createContext } from "react";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
export const UserContext = createContext();

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

const App=() =>{
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [userSet, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccess, grantLocationAccess] = useState(false);

  // const auth = getAuth();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setisLoggedIn(true);
  //       setUser(user);
  //     } else {
  //       setisLoggedIn(false);
  //       setUser(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  // const [user] = useAuthState(auth);
  const user = "x";

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

  return (
    <UserContext.Provider value={{ userLocation, user }}>
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
            <Protected user={user}>
              <ProfilePage />
            </Protected>
          }
        />
        <Route
          path="/createroom"
          element={
            <Protected user={user}>
              <CreateChatRoom />
            </Protected>
          }
        />
        <Route
          path="/joinroom"
          element={
            <Protected user={user}>
              <JoinRoom />
            </Protected>
          }
        />
        <Route
          path="/joinroom/:id"
          element={
            <Protected user={user}>
              <ChatRoom />
            </Protected>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      </>
    </UserContext.Provider>
  );
}
export default App;
