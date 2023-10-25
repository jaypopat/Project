import { useNavigate } from "react-router-dom";
import "./Header.css";
import { logout } from "../../firebase";
import { useContext } from "react";

import { UserContext } from "../App";

const Header = () => {
  const { user } = useContext(UserContext);

  let navigate = useNavigate();
  const redirectHome = () => {
    navigate("/");
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
            <button onClick={logout}>Log out</button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Header;
