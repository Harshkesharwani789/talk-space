import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { getSender } from "../config/chat";
import { toast } from "react-toastify";
import styles from "./MyChats.module.css";

export default function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(true);
  const { user, chats, setChats, selectedChat, setSelectedChat } = useContext(AuthContext);

  const fetchChats = async () => {
    if (!user || !user.token) {
      console.error("User or token not available");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_URL}/chat`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to load chats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
    fetchChats();
  }, [fetchAgain, user]);

  const getLatestMessage = (chat) => {
    if (chat.latestMessage && chat.latestMessage.content) {
      const content = chat.latestMessage.content.trim();
      return content ? (content.length > 50 ? content.substring(0, 50) + "..." : content) : "Empty message";
    }
    return "No messages yet";
  };

  const renderChatItem = (chat) => {
    const senderName = !chat.isGroupChat
      ? getSender(loggedUser, chat.users)
      : chat.chatName;
    const latestMessage = getLatestMessage(chat);

    return (
      <div
        key={chat._id}
        onClick={() => setSelectedChat(chat)}
        className={`${styles.chatItem} ${
          selectedChat === chat ? styles.selected : ""
        }`}
      >
        <div className={styles.chatName}>{senderName}</div>
        <p className={styles.latestMessage}>
          {chat.latestMessage && chat.latestMessage.sender && (
            <span className={styles.senderName}>
              {chat.latestMessage.sender.name}: 
            </span>
          )}
          {latestMessage}
        </p>
      </div>
    );
  };

  return (
    <div className={styles.myChats}>
      <h2>My Chats</h2>
      <div className={styles.chatList}>
        {loading ? (
          <div className={styles.loading}>Loading chats...</div>
        ) : chats && chats.length > 0 ? (
          chats.map(renderChatItem)
        ) : (
          <div className={styles.noChats}>No chats available</div>
        )}
      </div>
    </div>
  );
}