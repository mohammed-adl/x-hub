import { useMessage } from "../../contexts";
import { useEffect } from "react";

import styles from "./Messages.module.css";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

export default function Messages() {
  const { selectedChat, setSelectedChat } = useMessage();

  useEffect(() => {
    return () => {
      setSelectedChat(null);
    };
  }, [setSelectedChat]);

  return (
    <div className={styles.container}>
      <Sidebar />
      {selectedChat ? <ChatArea /> : null}
    </div>
  );
}
