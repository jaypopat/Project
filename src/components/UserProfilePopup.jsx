import {addDoc, collection, doc, getDocs, query, where} from "firebase/firestore";
import { db } from "../firebaseAuth";
import "./ProfilePagePopup.css"
import {useContext} from "react";
import {UserContext} from "../App.jsx";
import "./UserProfilePopup.css"

const UserProfilePopup = ({selectedUser, onClose}) => {
    const { user } = useContext(UserContext);

    const sendFriendReq = async () => {
        if (selectedUser.uid === user.uid) return;

        const friendRequestsRef = collection(db, "users", selectedUser.uid, "friendRequests");
        const friendsRef = collection(db, "users", selectedUser.uid, "friends");

        const existingReqQuery = query(friendRequestsRef, where("friendId", "==", user.uid));
        const existingReqSnapshot = await getDocs(existingReqQuery);

        if (!existingReqSnapshot.empty) {
            console.log("Friend Request already sent");
            return;
        }

        const existingFriendQuery = query(friendsRef, where("friendId", "==", user.uid));
        const existingFriendSnapshot = await getDocs(existingFriendQuery);

        if (!existingFriendSnapshot.empty) {
            console.log("Already Friends");
            return;
        }

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
                <div id="add-profile">
                    <button id="close-button" onClick={onClose}>Close</button>
                    <button id="add-friend" onClick={sendFriendReq}>Add Friend</button>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePopup;