import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithGoogle,logInWithEmailAndPassword } from "../firebaseAuth.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.emailVerified) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="responsive-background">
      <form action="" className="login-form">
        <div className="container-login">
          <h2 className="login-heading">Log In</h2>
          
          <p>Using your email and password</p>
          <input type="email" placeholder="Email@address.com" 
          className="login-box email"  value={email}
          onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" 
          className="login-box password" value={password}
          onChange={(e) => setPassword(e.target.value)} />

          <input type="submit" value="Log In" className="login-button"
          onClick={() => signInWithEmailAndPassword(auth,email, password)} />
          <p>or</p>
          <hr/>
          <div className="social-icons">
            <a onClick={signInWithGoogle} className="icon"><FaGoogle /></a>
          </div>
          <Link className="signUpLink" to="/forgot-password">Forgot your Password?</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
