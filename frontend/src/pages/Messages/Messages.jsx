import { useMessage } from "../../contexts";

import styles from "./Messages.module.css";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

export default function Messages() {
  const { selectedChat } = useMessage();

  return (
    <div className={styles.container}>
      <Sidebar />

      {selectedChat?.id && <ChatArea />}
    </div>
  );
}
