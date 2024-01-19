import { getAuth, onAuthStateChanged } from "firebase/auth";

function checkAuth(callback) {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

export default checkAuth;
