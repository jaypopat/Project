/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Login, Register, Header, Footer, About, ProfilePage, Protected, ErrorPage, CreateChatRoom, JoinRoom, ChatRoom, ForgotPassword,FriendList,FriendRequests,DM } from './components';
import { fetchLocation } from "./utils/fetchLocation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();
export const FriendRequestContext = createContext();


const App = () => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationFetchingInBackground, setIsLoadingGeo] = useState(true);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    fetchLocation()
      .then((location) => {
        setUserLocation(location);
        setIsLoadingGeo(false);
      })
      .catch((error) => {
        setIsLoadingGeo(false);
      });
  }, []);

  useEffect(() => {
  }, [userLocation]);

  const auth = getAuth();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);


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
      </>
    </UserContext.Provider>
  );
};
export default App;
