import React, { useEffect, useState } from 'react';
import { db } from '../firebaseAuth.js';
import { collection, doc, getDocs, query } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../App";
import './SidebarFriends.css';
import Spinner from './Spinner.jsx';

function SidebarFriends() {
    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id: dmFriend } = useParams();

    useEffect(() => {
        const getFriends = async () => {
            const userRef = doc(db, "users", user.uid);
            const friendRef = collection(userRef, "friends");
            const q = query(friendRef);
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };
    
        getFriends().then(friends => {
            const filteredFriends = friends.filter(friend => friend.friendId !== dmFriend);
            setFriends(filteredFriends);
            setLoading(false);
        });
    }, [dmFriend, user.uid]);
    

    return loading ? (
        <Spinner />
    ) : friends && friends.length > 0 ? (
        <div className="friend-list-sidebar">
            <h2 className='friend-heading'>Messages</h2>
            {friends.map((friend) => (
                <div key={friend.friendId} className="friend-item">
                    <Link to={`/dm/${friend.friendId}`} className="friend-link">
                        <img src={friend.friendPic} alt="Profile" className="profile-pic" />
                        <span className="friend-name">{friend.friendName}</span>
                    </Link>
                </div>
            ))}
        </div>
    ) : (
        <div className='empty-list'>
            <h2 className='no-friends'>Uh Oh...</h2>
            <p className='empty-state'>You have no friends. Maybe you should try make some!</p>
        </div>
    );
}

export default SidebarFriends;