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
    <div className="responsive-background">
        <nav className="navbar">
            <div className="brand-title phase-in">Warp</div>
            <div className="navbar-links phase-in">
                <ul>
                   <Link to="/login" className="links">Login</Link>
                   <Link to="/register" className="links">Register</Link>
                </ul>
            </div>
        </nav>
        <div className="content">
            <h1 className="slogan">Keep it Close.</h1>
            <p className="info">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Qui sit autem architecto? Aliquid deleniti cum ullam, 
                harum quae illum eligendi.</p>
            <Link to="/about"><button className="btn-learn-more phase-in">Learn More</button></Link>
        </div>
    </div>
  );
};
export default Home;