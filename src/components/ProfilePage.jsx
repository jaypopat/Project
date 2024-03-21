import { useContext } from "react";
import { UserContext } from "../App";
import "./ProfilePage.css"
import { toast } from "react-toastify";


import React, { useState } from 'react';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';

const ProfilePage = () => {
    const { user } = useContext(UserContext);

    const [displayName, setDisplayName] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');

    const [profilePicURL, setProfilePicURL] = useState(user.photoURL);

    const handleProfileUpdate = async () => {
        // Your existing code for updating profile
    
        // Show toast if profile is updated successfully
        if (displayName !== user.displayName || email !== user.email || password || profilePicURL !== user.photoURL) {
            try {
                await Promise.all([
                    displayName !== user.displayName && updateProfile(user, { displayName }),
                    email !== user.email && updateEmail(user, email),
                    password && updatePassword(user, password),
                    profilePicURL !== user.photoURL && updateProfile(user, { photoURL: profilePicURL })
                ]);
                toast.success('Profile updated successfully!', { autoClose: 3000 });
            } catch (error) {
                console.error('Error updating profile:', error);
                toast.error('Failed to update profile. Please try again.', { autoClose: 3000 });
            }
        }
    };
    console.log(user);
    return (
        <div className="profile-page">
            <h1>User Profile</h1>
            <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password (leave blank to keep current)"
            />
            <input
                type="text"
                value={profilePicURL}
                onChange={(e) => setProfilePicURL(e.target.value)}
                placeholder="Profile Picture URL"
            />
            <button onClick={handleProfileUpdate}>Update Profile</button>
        </div>
    );
};

export default ProfilePage;