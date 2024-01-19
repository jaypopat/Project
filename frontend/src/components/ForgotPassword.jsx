import { useState } from "react";
import { sendPasswordReset } from "../../firebase";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

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

        <button className="login__btn" onClick={() => sendPasswordReset(email)}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
