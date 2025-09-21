import { useUser } from "../../contexts";
import { generateAvatar, formatTimeAgo } from "../../utils";
import { Avatar } from "../../components/ui";
import styles from "./Messages.module.css";

export default function MessagesList({ messages, isPartnerTyping }) {
  const { user } = useUser();

  return (
    <>
      {messages.map((msg, index) => {
        const isMe = msg.sender.id === user.id;
        const isLast = index === 0;

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
                {formatTimeAgo(msg.createdAt)}
              </div>
              {isPartnerTyping && isLast && (
                <div className={styles.typingIndicator}>typing...</div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
