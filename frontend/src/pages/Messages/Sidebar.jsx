import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import styles from "./Messages.module.css";
import { Avatar, Spinner, ErrorMessage } from "../../components/ui";

import { useMessage, useUser } from "../../contexts";

import { handleGetAllConvos } from "../../fetchers";
import { generateAvatar, filterConversations } from "../../utils";
import { useCreateChat } from "../../hooks";

export default function Sidebar({ onSelectChat }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { selectedChat, setSelectedChat } = useMessage();

  const [username, setUsername] = useState(location.state?.username || null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isCreating, isComplete } = useCreateChat(
    username,
    setUsername,
    setSelectedChat
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: handleGetAllConvos,
    retry: 3,
    staleTime: 60000,
    enabled: isComplete,
  });

  const conversations = data?.conversations || [];
  const filteredConversations = filterConversations(conversations, searchTerm);

  useEffect(() => {
    if (!selectedChat && filteredConversations.length > 0) {
      const firstChat = {
        id: filteredConversations[0].id,
        partner: filteredConversations[0].partner,
      };
      setSelectedChat(firstChat);
    }
  }, [selectedChat, filteredConversations, setSelectedChat]);

  useEffect(() => {
    if (location.state?.username) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.username, navigate, location.pathname]);

  const handleChatClick = (conv) => {
    const chat = { id: conv.id, partner: conv.partner };
    setSelectedChat(chat);
    onSelectChat?.(chat);
  };

  if (isCreating || isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

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
            onClick={() => handleChatClick(conv)}
          >
            <Avatar
              src={
                conv.partner.profilePicture || generateAvatar(conv.partner.name)
              }
              alt={conv.partner.name}
              size={48}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${conv.partner.username}`);
              }}
            />
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <div className={styles.name}>{conv.partner.name}</div>
              </div>
              <div className={styles.lastMessage}>
                {conv.lastMessage?.content || ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
