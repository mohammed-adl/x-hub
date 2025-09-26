import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Messages.module.css";
import { Avatar, Spinner, ErrorMessage } from "../../components/ui";

import { useMessage } from "../../contexts";

import {
  generateAvatar,
  formatTimeAgo,
  filterConversations,
} from "../../utils";
import { useFetchConvos, useCreateChat } from "../../hooks";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat } = useMessage();

  const [username, setUsername] = useState(location.state?.username || null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isCreating, isComplete, body } = useCreateChat(
    username,
    setUsername,
    setSelectedChat
  );

  const { data, isLoading, error } = useFetchConvos(isComplete);
  const conversations = data?.conversations || [];

  if (isCreating || isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

  const filteredConversations = filterConversations(conversations, searchTerm);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.title}>Messages</div>
        <input
          type="text"
          placeholder="Search conversations..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.conversationsList}>
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.conversation} ${
              selectedChat?.id === conv.id ? styles.active : ""
            }`}
            onClick={() =>
              setSelectedChat({ id: conv.id, partner: conv.partner })
            }
          >
            <Avatar
              src={
                conv.partner.profilePicture ||
                generateAvatar(conv.partner.username)
              }
              alt={conv.partner.name}
              size={48}
              onClick={() => {
                e.stopPropagation();
                navigate(`/${conv.partner.username}`);
              }}
            />
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <div className={styles.name}>{conv.partner.name}</div>
                <div className={styles.time}>
                  {conv.lastMessage?.createdAt
                    ? formatTimeAgo(conv.lastMessage.createdAt)
                    : ""}
                </div>
              </div>
              <div className={styles.lastMessage}>
                {conv.lastMessage?.text || ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
