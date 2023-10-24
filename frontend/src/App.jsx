/* eslint-disable no-unused-vars */
// App.js
import { useState, useEffect, createContext } from "react";

import { Route, Routes, useRouteError } from "react-router-dom";
export const UserLocationContext = createContext();

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

function App() {
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
  const user = "jay";

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
    <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
      <>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} errorElement={<ErrorPage />} />

          <Route
            path="/register"
            element={<Register />}
            errorElement={<ErrorPage />}
          />
          <Route
            path="/login"
            element={<Login />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/about"
            element={<About />}
            errorElement={<ErrorPage />}
          />

          <Route
            path="/profile"
            element={
              <Protected user={user}>
                <ProfilePage />
              </Protected>
            }
            errorElement={<ErrorPage />}
          />

          <Route
            path="/createroom"
            element={
              <Protected user={user}>
                <CreateChatRoom />
              </Protected>
            }
            errorElement={<ErrorPage />}
          />

          <Route
            path="/joinroom"
            element={
              <Protected user={user}>
                <JoinRoom />
              </Protected>
            }
            errorElement={<ErrorPage />}
          />
        </Routes>

        <Footer />
      </>
    </UserLocationContext.Provider>
  );
}
export default App;
