import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import {collection, doc, getDocs, query, addDoc, deleteDoc } from "firebase/firestore";
import {db} from "../firebaseAuth.js";

const FriendRequests = () => {
    const { user : sender } = useContext(UserContext);
    const [ friendRequests, setFriendRequests ] = useState([]);

    useEffect(() => {
        const getFriendRequests = async () => {
            const userRef = doc(db, "users", sender.uid);
            const friendReqRef = collection(userRef, "friendRequests");
            const q = query(friendReqRef);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };
        getFriendRequests().then(requests => setFriendRequests(requests));
    }, [sender.uid]);

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

        try {
            console.log("Adding friend to sender...");
            await addFriend(sender.uid, {
                friendId: requestToAccept.friendId,
                friendName: requestToAccept.friendName,
                friendPic: requestToAccept.friendPic
            });
            console.log("Successfully added friend to sender.");

            let receiver = requestToAccept.friendId;
            console.log("Adding friend to receiver...");
            await addFriend(receiver, {
                friendId: sender.uid,
                friendName: sender.displayName,
                friendPic: sender.photoURL
            });
            console.log("Successfully added friend to receiver.");

            await deleteDoc(doc(db, "users", sender.uid, "friendRequests", requestId));

            setFriendRequests(currentRequests => currentRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error("Failed to accept friend request:", error);
        }
    };


    const handleDecline = async (requestId) => {
        try {
            await deleteDoc(doc(db, "users", sender.uid, "friendRequests", requestId));
            setFriendRequests(currentRequests => currentRequests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error("Failed to decline friend request:", error);
        }
    };

    if (friendRequests.length === 0) return null;

    return (
        <div>
            <h1>Friend Requests</h1>
            <ul>
                {friendRequests.map((request) => (
                    <li key={request.id}>
                        <p>{request.friendName}</p>
                        <button onClick={() => handleAccept(request.id)}>Accept</button>
                        <button onClick={() => handleDecline(request.id)}>Decline</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default FriendRequests;