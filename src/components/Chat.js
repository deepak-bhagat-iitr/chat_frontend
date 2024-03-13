import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };

      socket.emit("send_message", messageData);
      setMessageList((pre) => {
        return [...pre, messageData]
      });
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (receivedMessageData) => {
      // Check if the received message is the same as the one you sent
      const isSentMessage = receivedMessageData.room === room && receivedMessageData.author === username && receivedMessageData.message === currentMessage;

      // If it's not the sent message, add it to the message list
      if (!isSentMessage) {
        setMessageList((pre) => [...pre, receivedMessageData]);
      }
    });
  }, [username]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom
          className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={(username === messageContent.author) ? "you" : "other"}>
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Write Message..."
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
