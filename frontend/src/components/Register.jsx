import {useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import {
  // auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import "./Register.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // const [user, loading, error] = useAuthState(auth);
  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  return (
    <div class="responsive-background">
        <div class="container">
            <h2 class="login-heading">Sign Up</h2>
            <div class="social-icons">
                <a href="#" class="icon"><i class="fa-brands fa-google"></i></a>
                <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" class="icon"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>

            </div>
            <p>or use your email password</p>
            <input type="email" placeholder="Email@address.com" class="login-box email" />
            <input type="password" placeholder="Password" class="login-box password" />
            
            <button class="login-button">Login</button>
            <a href="https://www.google.com/" class="login-reset-link">Don't have an account?</a>
        </div>
    </div>
  );
}
export default Register;