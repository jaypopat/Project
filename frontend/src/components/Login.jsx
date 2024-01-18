/* eslint-disable no-unused-vars */
import React, {useState } from "react";
import { Link } from "react-router-dom";
import { auth, signInWithGoogle } from "../../firebase";
import {signInWithEmailAndPassword} from 'firebase/auth'
import "./Login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div class="responsive-background">
        <div class="container">
            <h2 class="login-heading">Log In</h2>
            <div class="social-icons">
                <a href="#" class="icon"><i class="fa-brands fa-google"></i></a>
                <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>           

            </div>
            <p>or use your email password</p>
            <input type="email" placeholder="Email@address.com" class="login-box email" />
            <input type="password" placeholder="Password" class="login-box password" />
            
            <button class="login-button">Sign UP</button>
        </div>
    </div>
  );
}
export default Login;

