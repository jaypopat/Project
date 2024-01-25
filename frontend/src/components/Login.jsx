/* eslint-disable no-unused-vars */
import React, {useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../firebase";
import { FirebaseLogin } from "../../auth/FirebaseLogin";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
          <input
            type="password"
            className="login__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        <button
          className="login__btn"
          onClick={() => LoginNavigateToHome(email, password)}
        >
          Login
        </button>

        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
    </div>
  );

  // Function to useNavigate to home (/)
  async function LoginNavigateToHome(email, password) {
    const user = await FirebaseLogin(email, password);
    console.log("Login Returned User: ", user);
    if (user) {
      navigate("/");
    } else {
      alert("Invalid Credentials");
    }
  }
}

export default Login;
