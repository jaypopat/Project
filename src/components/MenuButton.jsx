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
        toast.success('Signed out');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="menu-container">
            <button className="menu-button" onClick={handleMenuToggle}>
                <FontAwesomeIcon icon={faBars} size="2x" />
            </button>
            {isMenuOpen && (
                <div className="menu" onMouseLeave={handleMenuClose}>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleProfile}>Profile</button>
                </div>
            )}
        </div>
    );
};

export default MenuButton;