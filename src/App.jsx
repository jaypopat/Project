/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Login, Register, Header, Footer, About, ProfilePage, Protected, ErrorPage, CreateChatRoom, JoinRoom, ChatRoom, ForgotPassword } from './components';
import { fetchLocation } from "./utils/fetchLocation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FriendRequests from "./components/FriendRequests.jsx";
import FriendList from "./components/FriendList";
import DM from "./components/Dm";

export const UserContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationFetchingInBackground, setIsLoadingGeo] = useState(true);

  useEffect(() => {
    fetchLocation()
      .then((location) => {
        setUserLocation(location);
        console.log(location);
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

    return () => unsubscribe();
  }, []);
  console.log(user)


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
          <Route exact path="/forgot-password" element={<ForgotPassword />} />

          <Route exact path="/about" element={<About />} />
          <Route
            exact
            path="/profile"
            element={user ? <ProfilePage /> : <Login />}
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
              path="/friend-requests"
              element={
                <Protected>
                  <FriendRequests />
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
          <Route
            exact
            path="/dm"
            element={
              <Protected>
                <FriendList />
              </Protected>
            }
          />
          <Route
            exact
            path="/dm/:id"
            element={
              <Protected>
                <DM/>
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
