// components/Messages/Sidebar.js
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useUser, useMessage } from "../../contexts";
import { generateAvatar } from "../../utils";
import { Spinner, ErrorMessage, Avatar } from "../../components/ui";
import { handleGetAllConvos, handleCreateChat } from "../../fetchers";
import styles from "./Messages.module.css";

export default function Sidebar() {
  const { user } = useUser();
  const { selectedChat, setSelectedChat } = useMessage();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [error, setError] = useState(null);

  const { username: targetUsername } = location?.state || {};
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: handleGetAllConvos,
    retry: 3,
    staleTime: 60000, // 1 minute
  });

  const conversations = data?.conversations || [];

  // Filter conversations based on search
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.partner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.partner?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.content
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Handle target username from navigation
  useEffect(() => {
    if (!targetUsername || isCreatingChat) return;

    const existingConv = conversations.find(
      (c) => c.partner.username === targetUsername
    );

    if (existingConv) {
      setSelectedChat({
        id: existingConv.id,
        partnerId: existingConv.partnerId,
      });
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    } else {
      createNewChat(targetUsername);
    }
  }, [targetUsername, conversations, isCreatingChat]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedChat?.id && conversations.length > 0 && !isCreatingChat) {
      const firstConv = conversations[0];
      setSelectedChat({
        id: firstConv.id,
        partnerId: firstConv.partnerId,
      });
    }
  }, [selectedChat, conversations, setSelectedChat, isCreatingChat]);

  const createNewChat = async (username) => {
    if (isCreatingChat) return;

    setIsCreatingChat(true);
    setError(null);

    try {
      const { chat, partner } = await handleCreateChat(username);

      queryClient.setQueryData(["conversations"], (oldData) => {
        const oldConvos = oldData?.conversations || [];

        // Check if chat already exists
        if (oldConvos.some((c) => c.id === chat.id)) {
          return oldData;
        }

        return {
          ...oldData,
          conversations: [
            {
              id: chat.id,
              partnerId: partner.id,
              partner,
              lastMessage: null,
              createdAt: chat.createdAt || new Date().toISOString(),
            },
            ...oldConvos,
          ],
        };
      });

      setSelectedChat({ id: chat.id, partnerId: partner.id });

      // Clear navigation state
      navigate(location.pathname, { replace: true });
    } catch (err) {
      console.error("Failed to create chat:", err);
      setError(err.message || "Failed to create conversation");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSelect = (conversationId) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      setSelectedChat({
        id: conv.id,
        partnerId: conv.partnerId,
      });
    }
  };

  const formatLastMessage = (message) => {
    if (!message?.content) return "No messages yet";
    return message.content.length > 50
      ? `${message.content.substring(0, 50)}...`
      : message.content;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "now";
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  if (isLoading) return <Spinner />;
  if (queryError) return <ErrorMessage message={queryError.message} />;

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.title}>Messages</div>
        <input
          type="text"
          placeholder="Search conversations..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {isCreatingChat && (
        <div className={styles.creatingChat}>
          <Spinner size="small" />
          <span>Creating conversation...</span>
        </div>
      )}

      <div className={styles.conversationsList}>
        {filteredConversations.length === 0 ? (
          <div className={styles.noMessages}>
            {searchQuery ? "No conversations found" : "No conversations"}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const partner = conv.partner;
            const isActive = conv.id === selectedChat?.id;

            return (
              <div
                key={conv.id}
                className={`${styles.conversation} ${
                  isActive ? styles.active : ""
                }`}
                onClick={() => handleSelect(conv.id)}
              >
                <Avatar
                  src={partner?.profilePicture || generateAvatar(partner?.name)}
                  alt={partner?.name}
                  size={48}
                />
                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <div className={styles.name}>{partner?.name}</div>
                    <div className={styles.time}>
                      {formatTime(conv.lastMessage?.createdAt)}
                    </div>
                  </div>
                  <div className={styles.lastMessage}>
                    {formatLastMessage(conv.lastMessage)}
                  </div>
                </div>
                {conv.unreadCount > 0 && (
                  <div className={styles.unreadBadge}>{conv.unreadCount}</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
