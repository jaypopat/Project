import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

async function FirebaseLogin(email, password) {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Signed in
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    console.log(errorCode, errorMessage);
    return null;
  }
}

// Export the function explicitly
export { FirebaseLogin };