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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [FriendRequests, setFriendRequests] = useState([]);
    const [hasFriendRequests, setHasFriendRequests] = useState(false);

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
                    {hasFriendRequests && <div className="notification-badge">{FriendRequests.length}</div>}
                </button>
            </div>
            {isMenuOpen && (
                <div className="menu" onMouseLeave={handleMenuClose}>
                    <button onClick={handleProfile}>Profile</button>
                    <button onClick={handleFriendList}>Friend List</button>
                    <div className='friendRequestsButton'>
                        <button onClick={handleFriendRequests}>Friend Requests</button>
                        <p>{FriendRequests.length}</p>
                    </div>
                    <button onClick={handleLogout}>Logout</button>

                </div>
            )}
        </div>
    );
};

export default MenuButton;