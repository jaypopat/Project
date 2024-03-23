import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { logout } from '../firebaseAuth.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import './MenuButton.css';

const MenuButton = () => {
    let navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <button className="menu-button" onClick={handleMenuToggle}>
                <FontAwesomeIcon icon={faBars} size="2x" />
            </button>
            {isMenuOpen && (
                <div className="menu" onMouseLeave={handleMenuClose}>
                    <button onClick={handleProfile}>Profile</button>
                    <button onClick={handleFriendList}>Friend List</button>
                    <button onClick={handleFriendRequests}>Friend Requests</button>
                    <button onClick={handleLogout}>Logout</button>

                </div>
            )}
        </div>
    );
};

export default MenuButton;