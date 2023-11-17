/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext } from "react";
import { useNavigate, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateChatRoom from "./components/CreateChatRoom";
import JoinRoom from "./components/Rooms";
import Register from "./components/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import ProfilePage from "./components/ProfilePage";
import Protected from "./components/ProtectedRoute";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ErrorPage from "./components/NotFound";
import Home from "./components/Home";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import { toast } from "react-toastify";
export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationFetchingInBackground, setIsLoadingGeo] = useState(true);


  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          if (error.code == error.PERMISSION_DENIED) {
            console.log("User denied the request for Geolocation.");
            toast.error("Give access to location");
            reject("Location access denied by user");
          } else {
            console.log(error);
            reject(error);
          }
        },
        { enableHighAccuracy: true }
      );
    });
  };

  useEffect(() => {
    getLocation()
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate("/");
      } else {
        setUser(null);
        navigate ("/login");
      }
    }
    );
    return () => unsubscribe();
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{ userLocation, user, userLocationFetchingInBackground }}
    >
      <>
        <Header />

        <Routes>
          {user ? (
            // Routes for logged in users
            <>
              <Route exact path="/" element={<Home />} />
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
            </>
          ) : (
            <>
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/about" element={<About />} />
            </>
          )}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </>
    </UserContext.Provider>
  );
};
export default App;
