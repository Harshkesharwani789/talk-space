import React from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "./ScrollableChat.module.css";

export default function ScrollableChat({ messages }) {
  const { user } = React.useContext(AuthContext);

  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  return (
    <div className={styles.scrollableChat}>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} className={styles.messageContainer}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div >
                {/* <img src={""} alt={""} /> */}
              </div>
            )}
            <span
              className={`${styles.message} ${
                m.sender._id === user._id ? styles.sender : styles.receiver
              }`}
            >
              {m.message}
            </span>
          </div>
        ))}
    </div>
  );
}