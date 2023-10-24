import "./Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div id = "login">
      <Link to="/login">
        <button className="red">Login</button>
      </Link>

      <Link to="/register">
        <button className="red">Signup</button>
      </Link>
      <Link to="/createroom">
        <button className="red">Create Room</button>
      </Link>

      <Link to="/joinroom">
        <button className="red">Join Room</button>
      </Link>
    </div>
  );
};
export default Home;