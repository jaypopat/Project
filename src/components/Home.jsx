import "./Home.css";
import { Link } from "react-router-dom";
import { useContext } from 'react';

import { UserContext } from '../App';

const Home = () => {

  const { user } = useContext(UserContext);

  return user?.emailVerified ? (
    <div id="room-btns">
      <Link to="/createroom">
        <button className="red">Create Room</button>
      </Link>
      <Link to="/joinroom">
        <button className="red">Join Room</button>
      </Link>

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