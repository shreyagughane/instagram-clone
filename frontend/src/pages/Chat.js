import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://instagram-clone-eid7.onrender.com");

function Chat() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || storedUser?._id;

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  console.log("USER FROM LOCALSTORAGE:", storedUser);
  console.log("USER ID USED:", userId);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://instagram-clone-eid7.onrender.com/api/conversations/${userId}`
      );

      console.log("CONVERSATIONS:", res.data);
      setConversations(res.data);
    } catch (err) {
      console.log("Conversation error:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchConversations();
  }, [userId, fetchConversations]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(
        `https://instagram-clone-eid7.onrender.com/api/messages/${conversationId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const openChat = (conversation) => {
    setCurrentChat(conversation);
    fetchMessages(conversation._id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    const messageData = {
      conversationId: currentChat._id,
      sender: userId,
      text: newMessage,
    };

    try {
      await axios.post(
        "https://instagram-clone-eid7.onrender.com/api/messages",
        messageData
      );

      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ width: "320px", borderRight: "1px solid #ddd" }}>
        <h2 style={{ padding: "20px" }}>Messages</h2>

        {conversations.length === 0 ? (
          <p style={{ padding: "20px", color: "gray" }}>
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => openChat(conv)}
              style={{
                padding: "15px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              Chat {conv._id.slice(-5)}
            </div>
          ))
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
          {currentChat ? "Chat Open" : "Select a chat"}
        </div>

        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === userId ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "18px",
                  background:
                    msg.sender === userId ? "#0095f6" : "#e4e6eb",
                  color: msg.sender === userId ? "white" : "black",
                  maxWidth: "60%",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {currentChat && (
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "20px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: "10px",
                padding: "10px 15px",
                background: "#0095f6",
                color: "white",
                border: "none",
                borderRadius: "20px",
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;