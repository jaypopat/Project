import {addDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebaseAuth";
import "./ProfilePagePopup.css"
import {useContext} from "react";
import {UserContext} from "../App.jsx";

const UserProfilePopup = ({selectedUser, onClose}) => {
    const { user } = useContext(UserContext);

    const sendFriendReq = async () => {
        if (selectedUser.uid === user.uid) return;

        const userRef = doc(db, "users", selectedUser.uid);
        const friendReqRef = collection(userRef, "friendRequests");
        await addDoc(friendReqRef, {
            friendId: user.uid,
            friendName: user.displayName,
            friendPic: user.photoURL
        });
        console.log("Friend Request Sent");
    }

    if (!selectedUser) return null;
    return (
        <div>
        <h1 id="profile-popup-header" >{selectedUser.displayName}</h1>
            <div id="profile-popup-body">
                <img src={selectedUser.photoURL} alt="user" className="user-pic"/>
                <button onClick={onClose}>Close</button>
                <button id="add-friend" onClick={sendFriendReq}>Add Friend</button>
            </div>
        </div>
    );
}

export default UserProfilePopup;