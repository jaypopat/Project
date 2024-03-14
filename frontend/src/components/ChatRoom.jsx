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
import { addDoc, collection, getDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../firebase";

function ChatRoom() {
  const { id: roomId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");


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
        createdAt: new Date,
        user: auth.currentUser.displayName,
        userPic: auth.currentUser.photoURL,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message: ", error);
    }
  }

  const formatDate = (date) => {

    let minutes = date.getMinutes();
    let hours = date.getHours();

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
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
          <ChatContainer>
            <MessageList>
              <div className="messages">
                {messages.map((message) => (
                  <div className="message-container" key={message.id}>
                    <img src={message.userPic} alt="pfp" className="user-pic" />
                    <div className="message-content">
                      <span className="user-name">{message.user}</span>
                      <p className="message-text">{message.text}</p>
                      <p className="message-timestamp">
                        {/* {console.log(message.createdAt)} */}
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
