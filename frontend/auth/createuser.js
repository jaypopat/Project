import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

async function FirebaseCreateUser(email, password) {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Signed up 
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return null;
  }
}

// Export the function explicitly
export { FirebaseCreateUser };