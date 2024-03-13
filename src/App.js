import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io.connect("https://chat-backend-okcv.onrender.com/");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(true);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(false);
    }
  };
  const check = (event) => {
    if (event.key === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="App">
      {showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text" onKeyPress={check}
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text" onKeyPress={check}
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />

          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
