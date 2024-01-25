import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useContext } from "react";

import { UserContext } from "../App";
import { toast } from "react-toastify";
import { logout } from "../../firebase";

const Header = () => {
  const { user } = useContext(UserContext);

  let navigate = useNavigate();
  const redirectHome = () => {
    navigate("/");
  };
  const logoutHandler = () => {
    navigate("/");
    logout();
    toast.success("signed out");
    //firebase remove auth session
  };

  return (
    <>
      <div className="header">
        <p onClick={redirectHome} id="appName">
          Whisper
        </p>
        <p id="slogan">Keep it close</p>
        {user ? (
          <div id="logout">
          <button className="logout-button" onClick={logoutHandler}>
             <img src={user.photoURL} className="profile-pic" />
             <p className="username">{user.displayName}</p>
             <span className="logout-text">Log out</span>
          </button>
         </div>
         
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Header;
