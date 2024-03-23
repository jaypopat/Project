import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseAuth.js';
import { collection, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../App";


function FriendList() {
const { user } = useContext(UserContext);

 const  uid  = user.uid;
 const [friends, setFriends] = useState([]);

 useEffect(() => {
    const fetchFriends = async () => {
      try {
        const docRef = doc(db, "users", uid, "friends");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFriends(docSnap.data().friends);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchFriends();
 });

 return (
    <div className="friend-list">
      <h2>Friend List</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.friendId}>
            <Link to={`/dm/${uid}/${friendId}`}>
              DM {friend.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
 );
}

export default FriendList;
