import { useState } from "react";
import { sendPasswordReset } from "../firebaseAuth.js";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="responsive-background">
        <form action="">
            <div className="container-forgot">
                <h2 className="forgot-heading">Forgot Password</h2>
                <p className="forgot-msg">Send link to your email address</p>
                <input type="email" placeholder="Email@address.com" className="email-box"/>                
                <input type="submit" value="Send" className="send-button"/>
            </div>
        </form>
    </div>
  );
}

export default ForgotPassword;
