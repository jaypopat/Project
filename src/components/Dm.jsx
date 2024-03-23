import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {db} from '../firebaseAuth.js';
import {
    collection, doc, onSnapshot, query, orderBy, addDoc, Timestamp, getDoc
} from 'firebase/firestore';
import {auth} from '../firebaseAuth.js';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer, ChatContainer, MessageList, MessageInput, Sidebar, ConversationList
} from "@chatscope/chat-ui-kit-react";
import {UserContext} from "../App.jsx";
import "./Dm.css"
import Rooms from "./Rooms.jsx";
import UserProfilePopup from "./UserProfilePopup.jsx";
import FriendList from "./FriendList.jsx";


function DM() {
    const {user} = useContext(UserContext);
    const userId1 = user.uid;


    // Extract 'id' from the URL, which represents 'user2'
    const {id: userId2} = useParams();
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [user2Name, setuser2Name] = useState("");


    const getUserName = async (uid) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Room Name:", docSnap.data().name);
                return docSnap.data().name;
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            return null;
        }
    }


    // Correctly reference the DMs collection and a specific document within it
    const dmRef = doc(db, "DMs", `${userId1}_${userId2}`);
    // Assuming you want to reference a subcollection named "messages" within the document referenced by dmRef
    const messagesGroup = collection(dmRef, "messages");

    useEffect(() => {
        if (!userId1 || !userId2) return;

        const q = query(messagesGroup, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    setMessages((prevMessages) => [...prevMessages, {
                        ...change.doc.data(), id: change.doc.id,
                    },]);
                }
            });
        });

        getUserName(userId2).then(name => setuser2Name(name));

        return () => unsubscribe();
    }, [userId1, userId2]);


    const handleSubmit = async (messageText) => {
        if (!messageText.trim()) return;
        try {
            await addDoc(messagesGroup, {
                text: messageText,
                createdAt: Timestamp.now(),
                displayName: auth.currentUser.displayName,
                uid: auth.currentUser.uid,
                userPic: auth.currentUser.photoURL,
            });
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message: ", error);
        }
    }

    return (<div className="chatroom">
        <div className="chatroom-header">
            <h2>{user2Name}</h2>
            <Link to="/dm" className="chatroom-header-back">
                ⬅️ Back to all friends
            </Link>
        </div>
        <div className="chatroom-body">
            <MainContainer>
                <Sidebar position="left">
                    <ConversationList>
                        <FriendList/>
                    </ConversationList>
                </Sidebar>

                <ChatContainer>
                    <MessageList>

                        <div className="messages">
                            {messages.map((message) => (<div className="message-container" key={message.id}>
                                <img src={message.userPic} alt="pfp" className="user-pic"/>


                                <div className="message-content">
                                    <span className="user-name">{message.displayName}</span>
                                    <p className="message-text">{message.text}</p>
                                    <p className="message-timestamp">
                                        {message.createdAt?.seconds ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], {
                                            hour: '2-digit', minute: '2-digit'
                                        }) : 'No timestamp'}
                                    </p>
                                </div>
                            </div>))}
                        </div>

                    </MessageList>
                    <MessageInput
                        value={newMessage}
                        onChange={(val) => setNewMessage(val)}
                        onSend={handleSubmit}
                        placeholder="Type message here"
                    />
                </ChatContainer>
            </MainContainer>
        </div>
    </div>);
}

export default DM;
