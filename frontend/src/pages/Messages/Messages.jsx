import { useMessage } from "../../contexts";
import { useFetchConvos } from "../../hooks";

import styles from "./Messages.module.css";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { Spinner } from "../../components/ui";

export default function Messages() {
  const { selectedChat } = useMessage();
  const { isLoading } = useFetchConvos(true);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      {selectedChat ? (
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
