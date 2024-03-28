import {
  MainContainer,
  Sidebar,
  ConversationList,
  ChatContainer,
  MessageList,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import SidebarRooms from "./SidebarRooms";
import { Link, useParams } from "react-router-dom";
import "./ChatRoom.css";
import { useEffect, useState } from "react";
import { addDoc, collection, getDoc, doc, onSnapshot, orderBy, query, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseAuth.js";
import UserProfilePopup from "./UserProfilePopup.jsx";

function ChatRoom() {
  const { id: roomId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const getRoomName = async (roomId) => {
    try {
      const docRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().name;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      return null;
    }
  }

  useEffect(() => {
    setMessages([]);  // Clear messages on room switch
  
    if (!roomId) return;
  
    const roomRef = doc(db, "rooms", roomId);
    const messagesRef = collection(roomRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incomingMessages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setMessages(incomingMessages);
    });
  
    getRoomName(roomId).then(name => setRoomName(name));
  
    return () => unsubscribe();
  }, [roomId]);
  

  const handleSubmit = async (messageText) => {
    if (!messageText.trim()) return;
    try {
      const roomRef = doc(db, "rooms", roomId);
      const messagesRef = collection(roomRef, "messages");

      await addDoc(messagesRef, {
        text: messageText,
        createdAt: Timestamp.now(),
        displayName: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        userPic: auth.currentUser.photoURL,
      });

      await updateDoc(roomRef, {
        lastActivity: Timestamp.now(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message: ", error);
    }
  }

  return (
    <div className="chatroom">
      <div className="chatroom-header">
        <h2>{roomName}</h2>
      </div>
      <div className="chatroom-body">
        <MainContainer className="mainContainer">
          <div id="sidebar">
            <Sidebar id="sidebar" position="left">
              <ConversationList>
                <SidebarRooms />
              </ConversationList>
            </Sidebar>
          </div>
          {selectedUser ? (
            <UserProfilePopup
              selectedUser={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          ) : null
          }
          <ChatContainer>
            <MessageList>

              <div className="messages">
                {messages.map((message) => (
                  <div className="message-container" key={message.id}>
                    <img src={message.userPic} alt="pfp" className="user-pic" onClick={() => {
                      setSelectedUser({
                        uid: message.uid,
                        displayName: message.displayName,
                        photoURL: message.userPic
                      }
                      );
                    }} />
                    <div className="message-content">
                      <span className="user-name">{message.displayName}</span>
                      <p className="message-text">{message.text}</p>
                      <p className="message-timestamp">
                        {message.createdAt?.seconds ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No timestamp'}
                      </p>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
export default ChatRoom;
