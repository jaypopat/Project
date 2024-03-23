import {
  MainContainer,
  Sidebar,
  ConversationList,
  ChatContainer,
  ConversationHeader,
  MessageList,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Rooms from "./Rooms";
import { Link, useParams } from "react-router-dom";
import "./ChatRoom.css";
import { useEffect, useState } from "react";
import { addDoc, collection, getDoc, doc, onSnapshot, orderBy, query,Timestamp } from "firebase/firestore";
import { auth, db } from "../firebaseAuth.js";
import UserProfilePopup from "./userProfilePopup.jsx";

function ChatRoom() {
  const { id: roomId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);


  const getRoomName = async (roomId) => {
    try {
      const docRef = doc(db, "rooms", roomId);
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

  useEffect(() => {
    if (!roomId) return;

    const roomRef = doc(db, "rooms", roomId);
    const messagesRef = collection(roomRef, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...change.doc.data(),
              id: change.doc.id,
            },
          ]);
        }
      });
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
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message: ", error);
    }
  }

  return (
    <div className="chatroom">
      <div className="chatroom-header">
        <h2>{roomName}</h2>
        <Link to="/joinroom" className="chatroom-header-back">
          ⬅️ Back to all rooms
        </Link>
      </div>
      <div className="chatroom-body">
        <MainContainer>
          <Sidebar position="left">
            <ConversationList>
              <Rooms />
            </ConversationList>
          </Sidebar>
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
                    <img src={message.userPic} alt="pfp" className="user-pic" onClick={() => {setSelectedUser({
                      uid: message.uid,
                      displayName: message.displayName,
                      photoURL: message.userPic}
                    );}}/>
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
