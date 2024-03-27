import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useContext } from "react";
import { UserContext } from "../App";
import MenuButton from "./MenuButton";
import logo from "../assets/logo.png";
const Header = () => {
  let navigate = useNavigate();
  const { user } = useContext(UserContext);

  const redirectHome = () => {
    navigate("/");
  };

  const isRootOrAboutPage = location.pathname === "/" || location.pathname === "/about";

  return (
    <>
      {!isRootOrAboutPage && (
        <div className="header">
          {user?.emailVerified  ? (
              <>
                <Link className="warpBack" to="/">
                    <img src={logo} alt="Warp Logo" onClick={redirectHome} id="logo"/>
                  Warp
                </Link>
                <div id="hamburger">
                  <MenuButton/>
                </div>
              </>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
};

export default Header;