import { useNavigate } from 'react-router-dom';
import "./Header.css";
import { logout } from "../../firebase";


const Header = () => {
  let navigate = useNavigate();

  const redirectHome = () => {
    navigate('/');
  };

  return (
    <div className="header">
      <p onClick={redirectHome} id="appName">Whisper</p>
      <p id="slogan">Keep it close</p>
      <div id = "logout">
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  );
};

export default Header;