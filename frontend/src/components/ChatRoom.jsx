import {
  MainContainer,
  Sidebar,
  ConversationList,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Rooms from "./Rooms";
import {Link, useParams} from "react-router-dom";
import "./ChatRoom.css";
import {useEffect, useState} from "react";
import {addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";
import {auth, db} from "../../firebase";

function ChatRoom() {
  const { id: roomId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);


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
   
    return () => unsubscribe();
   }, [roomId]);

  const handleSubmit = async (messageText) => {
    if (!messageText.trim()) return;
    try {
      const roomRef = doc(db, "rooms", roomId);
      const messagesRef = collection(roomRef, "messages");

      await addDoc(messagesRef, {
        text: messageText,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
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
        <h2>Room name (will be fetched from uuid)</h2>
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
            <ConversationHeader>Room Name</ConversationHeader>
            <MessageList>

              {/* replace with nicer display*/}
              <div className="messages">
                {messages.map((message) => (
                    <div className="message" key={message.id}>
                      <span className="user">{message.user} : </span>
                      { message.text}
                    </div>
                ))}
                </div>


              {/*{messages.map((message, index) => (*/}
              {/*  <div key={index} className="message">*/}
              {/*    <p>{`${message.createdAt*/}
              {/*      .getHours()*/}
              {/*      .toString()*/}
              {/*      .padStart(2, "0")}:${message.createdAt*/}
              {/*      .getMinutes()*/}
              {/*      .toString()*/}
              {/*      .padStart(2, "0")}`}</p>*/}

              {/*    <div*/}
              {/*      className="avatar"*/}
              {/*      style={{ backgroundImage: `url(${message.avatar})` }}*/}
              {/*    />*/}
              {/*    <Message*/}
              {/*      model={{*/}
              {/*        message: message.text,*/}
              {/*        sentTime: message.createdAt,*/}
              {/*        sender: message.uid,*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*))}*/}
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
