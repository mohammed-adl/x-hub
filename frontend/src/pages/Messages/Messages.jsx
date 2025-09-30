import { useMessage } from "../../contexts";
import { useEffect, useState } from "react";

import styles from "./Messages.module.css";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

export default function Messages() {
  const { selectedChat, setSelectedChat } = useMessage();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    return () => {
      setSelectedChat(null);
    };
  }, [setSelectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowChat(true);
  };

  const handleBackToSidebar = () => {
    setShowChat(false);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${showChat ? styles.hideMobile : ""}`}>
        <Sidebar onSelectChat={handleSelectChat} />
      </div>
      {selectedChat && (
        <div
          className={`${styles.chatAreaWrapper} ${
            showChat ? styles.showMobile : ""
          }`}
        >
          <ChatArea onBack={handleBackToSidebar} />
        </div>
      )}
    </div>
  );
}
