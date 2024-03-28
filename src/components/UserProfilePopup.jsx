import { addDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseAuth";
import "./ProfilePagePopup.css"
import { useContext } from "react";
import { UserContext } from "../App.jsx";
import "./UserProfilePopup.css"
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

const UserProfilePopup = ({ selectedUser, onClose }) => {
    const { user } = useContext(UserContext);
    const sendToYourself = selectedUser.uid === user.uid;


    const sendFriendReq = async () => {

        if (sendToYourself) return;

        const friendRequestsRef = collection(db, "users", selectedUser.uid, "friendRequests");
        const friendsRef = collection(db, "users", selectedUser.uid, "friends");

        const existingReqQuery = query(friendRequestsRef, where("friendId", "==", user.uid));
        const existingReqSnapshot = await getDocs(existingReqQuery);

        if (!existingReqSnapshot.empty) {
            return;
        }

        const existingFriendQuery = query(friendsRef, where("friendId", "==", user.uid));
        const existingFriendSnapshot = await getDocs(existingFriendQuery);

        if (!existingFriendSnapshot.empty) {
            return;
        }

        const userRef = doc(db, "users", selectedUser.uid);
        const friendReqRef = collection(userRef, "friendRequests");
        await addDoc(friendReqRef, {
            friendId: user.uid,
            friendName: user.displayName,
            friendPic: user.photoURL
        });
        toast.success("friend request sent")
    }

    if (!selectedUser) return null;
    return (
        <div>
            <h1 id="profile-popup-header" >{selectedUser.displayName}</h1>
            <div id="profile-popup-body">
                <img src={selectedUser.photoURL} alt="user" className="user-pic" />
                <div id="add-profile">
                    <button id="close-button" onClick={onClose}>Close</button>
                    {sendToYourself ? (
                        <Link to={"/profile"} >
                            <button id="add-friend">Change Profile Details</button>
                        </Link>
                    ) : (
                        <button id="add-friend" onClick={sendFriendReq}>Add Friend</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfilePopup;
