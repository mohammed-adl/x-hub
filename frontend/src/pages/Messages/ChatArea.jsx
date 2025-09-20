import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../contexts";
import { handleGetChat, handleSendMessage } from "../../fetchers";
import { generateAvatar } from "../../utils";
import { send } from "../../assets/icons";
import { Spinner, ErrorMessage } from "../../components/ui";
import styles from "./Messages.module.css";

export default function ChatArea({
  conversationId,
  conversations,
  onConvoUpdate,
}) {
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();
  const bottomRef = useRef(null);

  const currentConvo =
    conversations.find((c) => c.partnerId === conversationId) || null;

  const partner =
    currentConvo?.lastMessage?.sender?.id === currentConvo?.partnerId
      ? currentConvo.lastMessage.sender
      : currentConvo?.lastMessage?.receiver || currentConvo?.partner;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["chat", conversationId],
    queryFn: ({ pageParam = 0 }) =>
      handleGetChat({
        limit: 20,
        cursor: pageParam,
        partnerId: conversationId,
      }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!conversationId,
  });

  // Ensure chronological order
  const messages = (data?.pages.flatMap((p) => p.chat) || []).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const tempMsg = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user.id,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    queryClient.setQueryData(["chat", conversationId], (old) => {
      if (!old) return { pages: [{ chat: [tempMsg] }] };
      return {
        ...old,
        pages: old.pages.map((p, i) =>
          i === old.pages.length - 1 ? { ...p, chat: [...p.chat, tempMsg] } : p
        ),
      };
    });

    setNewMessage("");
    const saved = await handleSendMessage(conversationId, newMessage);

    onConvoUpdate({
      ...currentConvo,
      partnerId: conversationId,
      partner: partner,
      lastMessage: saved,
    });

    queryClient.invalidateQueries(["chat", conversationId]);
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className={styles.chatArea}>
      <div className={styles.header}>{partner?.name}</div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>Send a message to start</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.id || msg.sender?.id === user.id;
            return (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  isMe ? styles.me : styles.other
                }`}
              >
                {!isMe && (
                  <img
                    src={generateAvatar(partner?.name)}
                    alt="avatar"
                    className={styles.messageAvatar}
                  />
                )}
                <div className={styles.textContainer}>
                  <div className={styles.text}>{msg.content}</div>
                  <div className={styles.timestamp}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {hasNextPage && !isFetchingNextPage && (
        <button onClick={() => fetchNextPage()}>Load more</button>
      )}

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Start a new message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <img src={send} alt="Send" />
        </button>
      </div>
    </div>
  );
}
