import { useContext } from "react";
import { UserContext } from "../App";
import "./ProfilePage.css"
import { toast } from "react-toastify";
import React, { useState } from 'react';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';

const storage = getStorage();

const ProfilePage = () => {
    const { user } = useContext(UserContext);
    const [displayName, setDisplayName] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [profilePicURL, setProfilePicURL] = useState(user.photoURL);

    const handleProfileUpdate = async () => {
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

    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profile-pics/${user.uid}`);
            const profilePicRef = ref(storageRef, file.name);
            await uploadBytes(profilePicRef, file);
            const profilePicURL = await getDownloadURL(profilePicRef);
            setProfilePicURL(profilePicURL);
        }
    }

    return (
        <div className="profile-page">
            <h1>User Profile</h1>
            <img id = "pfp" src={profilePicURL} alt="pfp" />
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
                type="file"
                onChange={handleProfilePicChange}
                accept={'.jpg, .jpeg, .png'}
                placeholder="Profile Picture URL"
            />
            <button onClick={handleProfileUpdate}>Update Profile</button>
        </div>
    );
};

export default ProfilePage;