import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseAuth.js';
import { collection, doc, getDoc, getDocs, query, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../App";

function FriendList() {
    const { user } = useContext(UserContext);
    const uid = user.uid;
    const [friends, setFriends] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({});

    useEffect(() => {
        const getFriends = async () => {
            const userRef = doc(db, "users", user.uid);
            const friendRef = collection(userRef, "friends");
            const q = query(friendRef);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };
        getFriends().then(friends => setFriends(friends));

        // Listen for new messages in each DM conversation
        friends.forEach(friend => {
            const dmRef = doc(db, "DMs", `${uid}_${friend.friendId}`);
            const messagesRef = collection(dmRef, "messages");
            const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
                const newMessagesCount = snapshot.size;
                setUnreadMessages(prev => ({
                    ...prev,
                    [friend.friendId]: newMessagesCount
                }));
            });

            return () => unsubscribe();
        });
    }, [user.uid, friends]);

    return (
        <div className="friend-list">
            <h2>Friend List</h2>
            <ul>
                {friends.map((friend) => (
                    <li key={friend.friendId}>
                        <Link to={`/dm/${friend.friendId}`}>
                            DM {friend.friendName}
                            {unreadMessages[friend.friendId] > 0 && <span className="notification-icon">{unreadMessages[friend.friendId]}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FriendList;
