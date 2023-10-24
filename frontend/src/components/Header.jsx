import { useNavigate } from 'react-router-dom';
import "./Header.css";

const Header = () => {
  let navigate = useNavigate();

  const redirectHome = () => {
    navigate('/');
  };

  return (
    <div className="header">
      <p onClick={redirectHome} id="appName">Whisper</p>
      <p id="slogan">Keep it close</p>
    </div>
  );
};

export default Header;
