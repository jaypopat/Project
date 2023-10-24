import "./Home.css";
import { Link } from "react-router-dom";
import { logout } from "../../firebase";

const Home = () => {
  const user = "wdw"; // fetch from firebase auth

  return user ? (
    <div id = "room-btns">
      <Link to="/createroom">
        <button className="red">Create Room</button>
      </Link>
      <Link to="/joinroom">
        <button className="red">Join Room</button>
      </Link>
      <div id = "logout">
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  ) : (
    <div id="login">
      <Link to="/login">
        <button className="red">Login</button>
      </Link>
      <Link to="/register">
        <button className="red">Signup</button>
      </Link>
    </div>
  );
};
export default Home;