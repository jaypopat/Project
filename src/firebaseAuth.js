import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";


import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyDrC7CEpSHF6W-3LeNwlYnXXNvvbMMcc1I",
    authDomain: "whisper-2f40a.firebaseapp.com",
    databaseURL: "https://whisper-2f40a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "whisper-2f40a",
    storageBucket: "whisper-2f40a.appspot.com",
    messagingSenderId: "436334501650",
    appId: "1:436334501650:web:39b308b96a9a78bf135dcb"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }    
  } catch (err) {
    console.error(err);
    alert(err.message);

  }
};

export const logInWithEmailAndPassword = (email, password) => {
 signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};



export const registerWithEmailAndPassword = async (name, email, password) => {
  try {
     const res = await createUserWithEmailAndPassword(auth, email, password);
     const user = res.user;
     console.log(user);
     await addDoc(collection(db, "users"), {
       uid: user.uid,
       name,
       authProvider: "email",
       email,
     });
 
     // Update the user's display name and profile picture
     await updateProfile(user, {
       displayName: name,
       photoURL: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${name}`
     });
 
     // Reload the user object to ensure it's up-to-date
     await user.reload();
 
     console.log("User registered and profile updated successfully");
  } catch (err) {
     console.error(err);
     alert(err.message);
  }
 };

export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
 };
 
export const logout = () => {
  signOut(auth);
  toast.success("signing out")
};
