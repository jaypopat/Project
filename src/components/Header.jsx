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

 
  // Check if we are on the root or "/about" page
  const isRootOrAboutPage = location.pathname === "/" || location.pathname === "/about";

  return (
    <>
      {/* Render the header only if not on the root or "/about" page */}
      {!isRootOrAboutPage && (
        <div className="header">
          {user?.emailVerified  ? (
              <>
                <h1 id="home-button" onClick={() => window.location.href = "/joinroom"}>Warp</h1>
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