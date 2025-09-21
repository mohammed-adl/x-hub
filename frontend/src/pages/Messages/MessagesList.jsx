import { generateAvatar } from "../../utils";

export default function MessagesList(messages, isPartnerTyping, selectedChat) {
  messages.map((msg, index) => {
    const isMe = msg.sender.id === user.id;
    return (
      <div
        key={`${msg.id}-${index}`}
        className={`${styles.message} ${isMe ? styles.me : styles.other}`}
      >
        {!isMe && (
          <img
            src={msg.sender.profilePicture || generateAvatar(msg.sender?.name)}
            alt="avatar"
            className={styles.messageAvatar}
          />
        )}
        <div className={styles.textContainer}>
          <div className={styles.text}>{msg.content}</div>
          <div className={styles.timestamp}>
            {new Date(msg.createdAt).toLocaleTimeString()}
          </div>
          {isPartnerTyping.has(selectedChat?.id) && (
            <div
              style={{
                backgroundColor: "red",
                color: "white",
                fontWeight: "bold",
                padding: "16px",
                position: "sticky",
                top: 0,
                zIndex: 9999,
              }}
            >
              typing...
            </div>
          )}
        </div>
      </div>
    );
  });
}
