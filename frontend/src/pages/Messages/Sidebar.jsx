// Sidebar.jsx
import styles from "./Messages.module.css";
import { generateAvatar } from "../../utils";

export default function Sidebar({ conversations, selectedId, onSelect }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.title}>Messages</div>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>

      {conversations.length === 0 ? (
        <div className={styles.noMessages}>You have no messages</div>
      ) : (
        conversations.map((conv) => {
          const partner =
            conv.lastMessage?.sender?.id === conv.partnerId
              ? conv.lastMessage.sender
              : conv.lastMessage?.receiver || conv.partner || conv;

          return (
            <div
              key={conv.partnerId || conv.id}
              className={`${styles.conversation} ${
                (conv.partnerId || conv.id) === selectedId ? styles.active : ""
              }`}
              onClick={() => onSelect(conv.partnerId || conv.id)}
            >
              <img
                src={generateAvatar(partner?.name)}
                alt={partner?.name}
                className={styles.avatar}
              />
              <div className={styles.info}>
                <div className={styles.name}>{partner?.name}</div>
                <div className={styles.lastMessage}>
                  {conv.lastMessage?.content || "Send a message to start"}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
