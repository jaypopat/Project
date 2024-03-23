import {addDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebaseAuth";
import "./ProfilePagePopup.css"

const UserProfilePopup = ({selectedUser, onClose}) => {
    const sendFriendReq = async () => {
        const userRef = doc(db, "users", selectedUser.uid);
        const friendReqRef = collection(userRef, "friendRequests");
        await addDoc(friendReqRef, {
            friendId: selectedUser.uid,
            friendName: selectedUser.displayName,
            friendPic: selectedUser.photoURL
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

//todo: make user not able to add themselves as a friend, add friend added toast notification