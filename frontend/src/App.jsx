/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CreateChatRoom from "./components/CreateChatRoom";
import JoinRoom from "./components/Rooms";
import Register from "./components/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import ProfilePage from "./components/ProfilePage";
import Protected from "./components/ProtectedRoute";
import ErrorPage from "./components/NotFound";
import Home from "./components/Home";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
export const UserContext = createContext();
import { fetchLocation } from "./utils/fetchLocation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ForgotPassword from "./components/ForgotPassword";

const App = () => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationFetchingInBackground, setIsLoadingGeo] = useState(true);

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

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{ userLocation, user, userLocationFetchingInBackground }}
    >
      <>
        <Header />

        <Routes>
          <Route exact path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />

          <Route exact path="/about" element={<About />} />
          <Route
            exact
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
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
