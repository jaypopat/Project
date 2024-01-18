import { getAuth, onAuthStateChanged } from "firebase/auth";

// eslint-disable-next-line no-unused-vars
function checkAuth(user) {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      return user;
    } else {
      // User is signed out
      return null;
    }
  });
}

export default checkAuth;