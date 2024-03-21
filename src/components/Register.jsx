import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, registerWithEmailAndPassword, signInWithGoogle } from "../firebaseAuth.js";
import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const register = async () => {
    if (!name) {
      alert("Please enter name");
      return;
    }
    try {
      await registerWithEmailAndPassword(name, email, password);
    } catch (error) {
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
      <div className="register">
        <div className="registercontainer">
          <input
              type="text"
              className="registertextBox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
          />
          <input
              type="text"
              className="registertextBox"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
          />
          <input
              type="password"
              className="registertextBox"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
          />
          <button className="registerbtn" onClick={register}>
            Register
          </button>
          <button
              className="registerbtn register__google"
              onClick={signInWithGoogle}
          >
            Register with Google
          </button>
          <div>
            Already have an account? <Link to="/login">Login</Link> now.
          </div>
        </div>
      </div>
  );
}

export default Register;