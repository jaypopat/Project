import './ChatRoom.css'
import { useParams } from 'react-router-dom';

function ChatRoom() {
  const {id} = useParams();
  console.log(id); // look up the room name correseponding to the number
  
  
  return (

        <div className="chat-container">
            <div className="chat-header">
                <h2>Room Name</h2>
            </div>
            <div className="chat-messages">
                {/* Individual messages will go here */}
            </div>
            <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
}

export default ChatRoom;

