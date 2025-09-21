import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useUser, useMessage } from "../../contexts";
import { generateAvatar } from "../../utils";
import { Spinner, ErrorMessage, Avatar } from "../../components/ui";
import { handleGetAllConvos } from "../../fetchers";
import styles from "./Messages.module.css";

export default function Sidebar() {
  const { user } = useUser();
  const userId = user?.id;
  const { selectedChat, setSelectedChat } = useMessage();
  const location = useLocation();
  const { sender } = location?.state || {};

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      try {
        return await handleGetAllConvos();
      } catch (e) {
        throw e;
      }
    },
  });

  const conversations = data?.conversations || [];

  useEffect(() => {
    if (!isLoading && conversations.length > 0 && !selectedChat?.id) {
      const firstId = conversations[0].id;
      setSelectedChat({ id: firstId, partnerId: conversations[0].partnerId });
    }
  }, [conversations, isLoading]);

  const handleSelect = (id) => {
    const conv = conversations.find((c) => c.id === id);
    setSelectedChat({ id: conv.id, partnerId: conv.partnerId });
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

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
        <div className={styles.noMessages}>No conversations</div>
      ) : (
        conversations.map((conv, index) => {
          const partner = conv.partner;

          const id = conv.id;

          return (
            <div
              key={conv.partnerId || id || index}
              className={`${styles.conversation} ${
                id === selectedChat.id ? styles.active : ""
              }`}
              onClick={() => handleSelect(id)}
            >
              <Avatar
                src={partner?.profilePicture || generateAvatar(partner?.name)}
                alt={partner?.name}
                size={37}
              />
              <div className={styles.info}>
                <div className={styles.name}>{partner?.name}</div>
                <div className={styles.lastMessage}>
                  {conv.lastMessage?.content || ""}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
