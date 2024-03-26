import "./Home.css";
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import { useEffect } from "react";

const Home = () => {

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.emailVerified) {
      // If the user's email is verified, navigate to a different path
      navigate('/joinroom');
    }
  }, [user, navigate]);

  return (
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