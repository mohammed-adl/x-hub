import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../contexts";
import { generateAvatar, formatTimeAgo } from "../../utils";

import { Avatar } from "../../components/ui";
import styles from "./Messages.module.css";

export default function MessagesList({ messages, isPartnerTyping }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showTimestamp, setShowTimestamp] = useState({});

  const reversedMessages = [...messages].reverse();

  const toggleTimestamp = (messageId) => {
    setShowTimestamp((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  return (
    <>
      {reversedMessages.map((msg, index) => {
        const isMe = msg?.sender.id === user.id;
        const isLast = index === reversedMessages.length - 1;

        return (
          <div
            key={`${msg?.id}-${index}`}
            className={`${styles.message} ${isMe ? styles.me : styles.other}`}
          >
            {!isMe && (
              <Avatar
                src={
                  msg?.sender.profilePicture ||
                  generateAvatar(msg?.sender?.name)
                }
                alt="avatar"
                size={43}
                onClick={() => navigate(`/${msg?.sender?.username}`)}
              />
            )}
            <div className={styles.textContainer}>
              <div
                className={styles.text}
                onClick={() => toggleTimestamp(msg?.id)}
              >
                {msg?.content}
              </div>
              {showTimestamp[msg?.id] && (
                <div className={styles.timestamp}>
                  {formatTimeAgo(msg?.createdAt)}
                </div>
              )}
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
