import {useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseCreateUser } from "../../auth/createuser";
import { signInWithGoogle } from "../../firebase";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // const [user, loading, error] = useAuthState(auth);

  return (
    <div className="register">
      <div className="register__container">
        <input
          type="text"
          className="register__textBox"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className="register__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="register__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="register__btn"
                onClick={() => RegisterNavigateToHome(email, password) }>
          Register
        </button>
        <button
          className="register__btn register__google"
          onClick={signInWithGoogle}        >
          Register with Google
        </button>
        <div>
          Already have an account? <Link to="/login">Login</Link> now.
        </div>
      </div>
    </div>
  );

  // Function to useNavigate to home (/)
  async function RegisterNavigateToHome(email, password) {
    const user = await FirebaseCreateUser(email, password);
    console.log("Register Returned User: ", user);
    if (user) {
      navigate("/");
    } else {
      alert("Invalid Credentials");
    }
  }
}
export default Register;