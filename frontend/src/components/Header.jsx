import "./Header.css";
// eslint-disable-next-line react/prop-types
const Header = ({redirectHome}) => {
  return (
    <div className="header">
      <p onClick = {redirectHome} id="appName">Whisper</p>
      <p id = "slogan">Keep it close</p>
    </div>
    
  );
};
export default Header;
