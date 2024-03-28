import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "../firebaseAuth.js";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const register = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter name");
      return;
    }
    try {
      await registerWithEmailAndPassword(name, email, password);
      alert("A verification email has been sent to your email address. Please check your inbox and click on the verification link to complete the registration process.");
    } catch (error) {
        console.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="responsive-background">
    <form action="">
      <div className="container-register">
        <h2 className="login-heading">Sign Up</h2>

        <p>Using your email and password</p>
        <input
            type="text"
            placeholder="Name"
            className="login-box name"
            value={name}
            onChange={(e) => setName(e.target.value)}/>

        <input
            type="text"
            placeholder="Email@address.com"
            className="login-box email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

        <input
            type="password"
            placeholder="Password"
            className="login-box password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

        <input
            type="submit"
            value="Sign Up"
            className="login-button"
            onClick={register}/>
        <p>or</p>
        <hr/>
        <div className="social-icons">
          <a onClick={signInWithGoogle} className="icon"><FaGoogle /></a>
        </div>
        <Link className="signUpLink" to="/login">Already have an account?</Link>
      </div>
    </form>
  </div>


  );
}

export default Register;