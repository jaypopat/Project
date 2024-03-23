import React, { useEffect, useState } from 'react';
import { db } from '../firebaseAuth.js';
import { collection, doc, getDocs, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../App";
import './FriendList.css';

function FriendList() {
    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const getFriends = async () => {
            const userRef = doc(db, "users", user.uid);
            const friendRef = collection(userRef, "friends");
            const q = query(friendRef);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };
        getFriends().then(friends => setFriends(friends));
    }, []);

    return (
        <div className="friend-list">
            <h2>Friend List</h2>
            {friends.map((friend) => (
                <div key={friend.friendId} className="friend-item">
                    <Link to={`/dm/${friend.friendId}`} className="friend-link">
                        DM {friend.friendName}
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default FriendList;