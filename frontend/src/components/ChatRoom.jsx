/* eslint-disable no-unused-vars */
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
import { Link } from "react-router-dom";
import "./ChatRoom.css";

const messages = [
  {
    id: "1",
    text: "Hello!",
    createdAt: new Date(),
    uid: "user1",
    avatar: "https://i.pravatar.cc/50?img=1",
  },
  {
    id: "2",
    text: "Hi!",
    createdAt: new Date(),
    uid: "user2",
    avatar: "https://i.pravatar.cc/50?img=2",
  },
  {
    id: "3",
    text: "How are you?",
    createdAt: new Date(),
    uid: "user1",
    avatar: "https://i.pravatar.cc/50?img=3",
  },
];
console.log(messages[0].createdAt.getTime);

function ChatRoom() {
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
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <p>{`${message.createdAt
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${message.createdAt
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`}</p>

                  <div
                    className="avatar"
                    style={{ backgroundImage: `url(${message.avatar})` }}
                  />
                  <Message
                    model={{
                      message: message.text,
                      sentTime: message.createdAt,
                      sender: message.uid,
                    }}
                  />
                </div>
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatRoom;
