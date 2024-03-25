import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useContext } from "react";
import { UserContext } from "../App";
import MenuButton from "./MenuButton";

const Header = () => {
  let navigate = useNavigate();
  const { user } = useContext(UserContext);

  const redirectHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="header">
        <p onClick={redirectHome} id="appName">
          Warp
        </p>
        <p id="slogan">Keep it close</p>
        {user?.emailVerified ? (
          <div id="hamburger">
            <MenuButton/>
         </div>
         
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Header;
