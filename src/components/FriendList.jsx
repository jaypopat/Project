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

    return friends && friends.length > 0 ? (
        <div className='responsive-background'>
            <div className="friend-list">
                <h2 className='friend-heading'>Friend List</h2>
                {friends.map((friend) => (
                    <div key={friend.friendId} className="friend-item">
                        <Link to={`/dm/${friend.friendId}`} className="friend-link">
                            <img src={friend.friendPic} alt="Profile" className="profile-pic" />
                            <span className="friend-name">{friend.friendName}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div className='empty-list'>
        <h2 className='no-friends'>Uh Oh...</h2>
        <p className='empty-state'>You have no friends. Maybe you should try make some!</p>
        <Link to="/joinroom" className='join-link'><button className='find-room'>Join a Room</button></Link>
        </div>
      );
}

export default FriendList;