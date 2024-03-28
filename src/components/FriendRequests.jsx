import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App.jsx";
import { collection, doc, getDocs, query, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseAuth.js";
import { Link } from 'react-router-dom';
import "./FriendRequests.css"

const FriendRequests = () => {
    const { user } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState([]);

    useEffect(() => {
        const getFriendRequests = async () => {
            const userRef = doc(db, "users", user.uid);
            const friendReqRef = collection(userRef, "friendRequests");
            const q = query(friendReqRef);
            const querySnapshot = await getDocs(q);
            const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFriendRequests(requests);
        };
        getFriendRequests();
    }, [user.uid]);

    const addFriend = async (userId, friendData) => {
        try {
            await addDoc(collection(db, "users", userId, "friends"), friendData);
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    const handleAccept = async (requestId) => {
        const requestToAccept = friendRequests.find(request => request.id === requestId);
        if (!requestToAccept) return;

        try { // Add friend to user's friend list
            await addFriend(user.uid, {
                friendId: requestToAccept.friendId,
                friendName: requestToAccept.friendName,
                friendPic: requestToAccept.friendPic
            });

            await addFriend(requestToAccept.friendId, { // Add user to friend's friend list
                friendId: user.uid,
                friendName: user.displayName,
                friendPic: user.photoURL
            });

            await deleteDoc(doc(db, "users", user.uid, "friendRequests", requestId)); // Delete friend request
            // Force a reload of MenuButton to update the friends list
            setFriendRequests(currentRequests => currentRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error("Failed to accept friend request:", error);
        }
    };

    const handleDecline = async (requestId) => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "friendRequests", requestId));
            setFriendRequests(currentRequests => currentRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error("Failed to decline friend request:", error);
        }
    };

    const getNumberOfRequests = () => {
        return friendRequests.length;
    }

    if (friendRequests.length === 0) return (
        <div className="no-requests">
            <h1 className="no-requests-msg">Womp Womp</h1>
            <p className="empty-state">You have no current friend requests pending</p>
            <Link to="/joinroom" className='join-link'><button className='find-room'>Join a Room</button></Link>
        </div>
    );
    return (
        <div className="container-request-friends">
            <h1 className="header-requests">Friend Requests</h1>
            <ul>
                {friendRequests.map((request) => (
                    <li key={request.id}>
                        <p>{request.friendName}</p>
                        <div className="button-holder">
                            <button className="accept-friend"
                                onClick={() => handleAccept(request.id)}>Accept</button>
                            <button className="decline-friend"
                                onClick={() => handleDecline(request.id)}>Decline</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendRequests;
