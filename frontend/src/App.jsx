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
import { toast } from "react-toastify";
export const UserContext = createContext();
import { fetchLocation } from "./utils/fetchLocation";

const App = () => {
  // const [userSet, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationFetchingInBackground, setIsLoadingGeo] = useState(true);

  const user = "kjk";

  useEffect(() => {
    fetchLocation()
      .then((location) => {
        setUserLocation(location);
        setIsLoadingGeo(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingGeo(false);
      });
  }, []);

  useEffect(() => {
    console.log(userLocation);
  }, [userLocation]);

  return (
    <UserContext.Provider
      value={{ userLocation, user, userLocationFetchingInBackground }}
    >
      <>
        <Header />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/about" element={<About />} />
          <Route
            exact
            path="/profile"
            element={
              <Protected>
                <ProfilePage />
              </Protected>
            }
          />
          <Route
            exact
            path="/createroom"
            element={
              <Protected>
                <CreateChatRoom />
              </Protected>
            }
          />
          <Route
            exact
            path="/joinroom"
            element={
              <Protected>
                <JoinRoom />
              </Protected>
            }
          />
          <Route
            exact
            path="/joinroom/:id"
            element={
              <Protected>
                <ChatRoom />
              </Protected>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </>
    </UserContext.Provider>
  );
};
export default App;
