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

  // Determine which chat to select / create
  let chatToSelect = selectedChat;
  if (!selectedChat?.id && conversations.length > 0) {
    chatToSelect = {
      id: conversations[0].id,
      partnerId: conversations[0].partnerId,
    };
  }

  if (targetUsername) {
    const existing = conversations.find(
      (c) => c.partner.username === targetUsername
    );
    if (existing) {
      chatToSelect = { id: existing.id, partnerId: existing.partnerId };
    } else {
      try {
        const body = handleCreateChat(targetUsername); // assuming this returns a Promise
        // merge into conversations safely after resolving
        body
          .then(({ chat, partner }) => {
            queryClient.setQueryData(["conversations"], (oldData) => {
              const oldConvos = oldData?.conversations || [];
              // avoid duplicates
              if (!oldConvos.some((c) => c.id === chat.id)) {
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
              }
              return oldData;
            });
            setSelectedChat({ id: chat.id, partnerId: partner.id });
          })
          .catch(console.log);
      } catch (err) {
        console.log(err);
      }
    }
  }

  if (!selectedChat?.id && chatToSelect) {
    setSelectedChat(chatToSelect);
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
