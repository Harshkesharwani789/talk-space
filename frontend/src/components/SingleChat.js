import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../config/chat";
import ScrollableChat from "./ScrollableChat";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import styles from "./SingleChat.module.css";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat } = useContext(AuthContext);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop-typing", selectedChat._id);
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_URL}/message`,
          {
            message: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setNewMessage("");
        socket.emit("new-message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error sending message");
      }
    }
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message-received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Handle notifications
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className={styles.singleChat}>
      {selectedChat ? (
        <>
          <div className={styles.chatHeader}>
            <button
              onClick={() => setSelectedChat(null)}
              className={styles.backButton}
            >
              Back
            </button>
            <h3>
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName}
            </h3>
          </div>

          <div className={styles.chatMessages}>
            {loading ? (
              <div>Loading messages...</div>
            ) : (
              <ScrollableChat messages={messages} />
            )}
          </div>

          <div className={styles.typingIndicator}>
            {isTyping && <div>Typing...</div>}
          </div>

          <div className={styles.chatInput}>
            {isTyping && <div className={styles.typing}>Typing...</div>}
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
            />
          </div>
        </>
      ) : (
        <div className={styles.noChatSelected}>
          Click on a user to start chatting
        </div>
      )}
    </div>
  );
};

export default SingleChat;