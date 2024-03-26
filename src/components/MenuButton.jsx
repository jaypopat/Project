import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App.jsx';
import { toast } from 'react-toastify';
import { logout } from '../firebaseAuth.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {collection, doc, getDocs, query, addDoc, deleteDoc } from "firebase/firestore";
import {db} from "../firebaseAuth.js";
import './MenuButton.css';

const MenuButton = () => {
    let navigate = useNavigate();

    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [FriendRequests, setFriendRequests] = useState([]);
    const [hasFriendRequests, setHasFriendRequests] = useState(false);
    const [numUnseenMessages, setNumUnseenMessages] = useState(0);

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
        if (FriendRequests.length > 0) {
            setHasFriendRequests(true);
        }
    });

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


    // Check how many unseen messages there are for the current user and set the number of unseen messages
    useEffect(() => {
        console.log(friends)
        const checkUnseenMessages = async () => {
            for (const friend of friends) {
                const dmDocId = [user.uid, friend.friendId].sort().join('-');
                const dmDocRef = doc(db, "dms", dmDocId);
                const messagesRef = collection(dmDocRef, "messages");
                const q = query(messagesRef);
                const querySnapshot = await getDocs(q);
                const messages = querySnapshot.docs.map(doc => doc.data());
                const unseenMessages = messages.filter(message => message.uid === friend.friendId && !message.seen);
                if (unseenMessages.length > 0) {
                    setNumUnseenMessages(numUnseenMessages + unseenMessages.length);
                }
            }
        };
        checkUnseenMessages();
    } , [friends, user.uid]);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        navigate('/');
        logout();
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    const handleFriendRequests = () => {
        navigate('/friend-requests');
    }

    const handleFriendList = () => {
        navigate('/dm');
    }



    return (
        <div className="menu-container">
            <div>
                <button className="menu-button" onClick={handleMenuToggle}>
                    <FontAwesomeIcon icon={faBars} size="2x" />
                    {(numUnseenMessages > 0 || hasFriendRequests) && <p className='notification'>{numUnseenMessages + FriendRequests.length}</p>}
                </button>
            </div>
            {isMenuOpen && (
                <div className="menu" onMouseLeave={handleMenuClose}>
                    <button onClick={handleProfile}>Profile</button>
                    <div className='friendButton' onClick={handleFriendList}>
                        <button>Friend List</button>
                        {(numUnseenMessages > 0) && <span className='badge'>{numUnseenMessages}</span>}
                    </div>
                    <div className='friendButton' onClick={handleFriendRequests}>
                        <button>Friend Requests</button>
                        {(FriendRequests.length > 0) && <span className='badge'>{FriendRequests.length}</span>}
                    </div>
                    <button onClick={handleLogout}>Logout</button>

                </div>
            )}
        </div>
    );
};

export default MenuButton;