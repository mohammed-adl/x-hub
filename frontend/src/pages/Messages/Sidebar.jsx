import { useLocation } from "react-router-dom";
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
  const { username: targetUsername } = location?.state || {};
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: handleGetAllConvos,
  });

  const conversations = data?.conversations || [];

  if (!isLoading && !selectedChat?.id) {
    if (targetUsername) {
      const existing = conversations.find(
        (c) => c.partner.username === targetUsername
      );
      if (existing) {
        setSelectedChat({ id: existing.id, partnerId: existing.partnerId });
      } else {
        (async () => {
          try {
            const body = await handleCreateChat(targetUsername);
            const { chat, partner } = body;
            setSelectedChat({ id: chat.id, partnerId: partner.id });
            queryClient.setQueryData(["conversations"], (oldData) => {
              const oldConvos = oldData?.conversations || [];
              return {
                ...oldData,
                conversations: [
                  {
                    id: chat.id,
                    partnerId: partner.id,
                    partner,
                    lastMessage: null,
                  },
                  ...oldConvos,
                ],
              };
            });
          } catch (err) {
            console.log(err);
          }
        })();
      }
    } else if (conversations.length > 0) {
      const firstConv = conversations[0];
      setSelectedChat({ id: firstConv.id, partnerId: firstConv.partnerId });
    }
  }

  const handleSelect = (id) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) setSelectedChat({ id: conv.id, partnerId: conv.partnerId });
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
                id === selectedChat?.id ? styles.active : ""
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
