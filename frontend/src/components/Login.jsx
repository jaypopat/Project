/* eslint-disable no-unused-vars */
import React, {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../firebase";
import { FirebaseLogin } from "../../auth/FirebaseLogin";
import "./Login.css";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          onClick={() => NavigateToHome(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          Dont have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );

  // Function to useNavigate to home (/)
  async function NavigateToHome(email, password) {
    const user = await FirebaseLogin(email, password);
    console.log("Returned User: ", user);
    if (user) {
      navigate("/home");
    } else {
      alert("Invalid Credentials");
    }
  }
}
export default Login;

