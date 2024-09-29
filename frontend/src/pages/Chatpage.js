import React, { useState } from "react";
import SideBar from "../components/SideBar";
import MyChats from "../components/MyChats";
import ChatContainer from "../components/ChatContainer";
import styles from "./Chatpage.module.css";

export default function Chatpage() {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className={styles.chatpage}>
      <SideBar />
      <div className={styles.chatSection}>
        <MyChats fetchAgain={fetchAgain} />
        <ChatContainer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
}