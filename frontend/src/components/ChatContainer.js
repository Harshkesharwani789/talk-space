import React, { useContext } from "react";
import SingleChat from "./SingleChat";
import { AuthContext } from "../context/AuthContext";
import styles from "./ChatContainer.module.css";

export default function ChatContainer({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = useContext(AuthContext);

  return (
    <div className={styles.chatContainer}>
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <div className={styles.welcomeMessage}>
          <h2>Welcome to Chat App</h2>
          <p>Select a chat to start messaging</p>
          <div className={styles.illustration}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="#e7f3ff" />
              <path d="M60 80 Q100 120 140 80" stroke="#1877f2" strokeWidth="4" fill="none" />
              <circle cx="80" cy="70" r="10" fill="#1877f2" />
              <circle cx="120" cy="70" r="10" fill="#1877f2" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}