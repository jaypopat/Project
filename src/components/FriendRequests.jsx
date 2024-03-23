import {useContext, useEffect, useState} from "react";
import {UserContext} from "../App.jsx";
import {collection, doc, getDocs, query, addDoc, deleteDoc } from "firebase/firestore";
import {db} from "../firebaseAuth.js";

const FriendRequests = () => {
    const { user } = useContext(UserContext);
    const [ friendRequests, setFriendRequests ] = useState([]);

    useEffect(() => {
        const getFriendRequests = async () => {
            const userRef = doc(db, "users", user.uid);
            const friendReqRef = collection(userRef, "friendRequests");
            const q = query(friendReqRef);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };
        getFriendRequests().then(requests => setFriendRequests(requests));
    }, [user.uid]);


    const handleAccept = async (requestId) => {
        const requestToAccept = friendRequests.find(request => request.id === requestId);
        if (!requestToAccept) return;

        try {
            await addDoc(collection(doc(db, "users", user.uid), "friends"), {
                friendId: requestToAccept.friendId,
                friendName: requestToAccept.friendName,
                friendPic: requestToAccept.friendPic
            });
            await deleteDoc(doc(db, "users", user.uid, "friendRequests", requestId));
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