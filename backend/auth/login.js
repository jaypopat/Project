import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../frontend/firebase"

export default async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error during sign-in:", errorCode, errorMessage);
    throw error; // Rethrow the error if you want to handle it outside this function
  }
}
