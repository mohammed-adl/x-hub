import { useUser } from "../../contexts";
import { generateAvatar } from "../../utils";

import { Avatar } from "../../components/ui";
import styles from "./Messages.module.css";

export default function MessagesList({
  messages,
  isPartnerTyping,
  selectedChat,
}) {
  const { user } = useUser();

  console.log(messages);

  return (
    <>
      {messages.map((msg, index) => {
        const isMe = msg.sender.id === user.id;
        return (
          <div
            key={`${msg.id}-${index}`}
            className={`${styles.message} ${isMe ? styles.me : styles.other}`}
          >
            {!isMe && (
              <Avatar
                src={
                  msg.sender.profilePicture || generateAvatar(msg.sender?.name)
                }
                alt="avatar"
                size={43}
              />
            )}
            <div className={styles.textContainer}>
              <div className={styles.text}>{msg.content}</div>
              <div className={styles.timestamp}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
              {isPartnerTyping.has(selectedChat?.id) &&
                index === messages.length - 1 && (
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
      })}
    </>
  );
}
