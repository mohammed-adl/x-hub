// components/Messages/Messages.js
import { useMessage } from "../../contexts";
// import { ErrorBoundary } from "../../components/ErrorBoundary";

import styles from "./Messages.module.css";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";

function MessagesContent() {
  const { selectedChat } = useMessage();

  return (
    <div className={styles.container}>
      <Sidebar />
      {selectedChat?.id ? (
        <ChatArea />
      ) : (
        <div className={styles.emptyChatArea}>
          <div className={styles.emptyMessage}>
            <h3>Select a conversation to start messaging</h3>
            <p>Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Messages() {
  return (
    // <ErrorBoundary fallback="Something went wrong with the messaging system">
    <MessagesContent />
    // </ErrorBoundary>
  );
}
