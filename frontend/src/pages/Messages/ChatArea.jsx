import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useUser, useMessage } from "../../contexts";
import { handleGetChat, handleSendMessage } from "../../fetchers";

import { send } from "../../assets/icons";
import MessagesList from "./MessagesList";
import { Spinner, ErrorMessage } from "../../components/ui";
import styles from "./Messages.module.css";

export default function ChatArea() {
  const { setIsTyping, selectedChat, isPartnerTyping } = useMessage();
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = useRef(null);
  const chatId = selectedChat?.id;
  const partnerId = selectedChat?.partnerId;
  const typingTimeoutRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chat", chatId],
    queryFn: ({ pageParam = 0 }) =>
      handleGetChat({ limit: 20, cursor: pageParam, chatId }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!chatId,
  });

  const messages = data?.pages.flatMap((p) => p.chat) || [];

  const handleTyping = (value) => {
    setNewMessage(value);
    setIsTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await handleSendMessage(chatId, partnerId, newMessage);
    } catch (err) {
      console.log(err);
    }
    setNewMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;

    if (messages.length && !isFetchingNextPage) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;

    const onScroll = () => {
      const nearTop = container.scrollTop <= 100;

      if (nearTop && hasNextPage && !isFetchingNextPage) {
        const prevScrollHeight = container.scrollHeight;
        fetchNextPage().then(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop =
            newScrollHeight - prevScrollHeight + container.scrollTop;
        });
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className={styles.chatArea}>
      <div className={styles.messages} ref={messagesRef}>
        {isFetchingNextPage && <Spinner />}
        {messages.length === 0 ? (
          <div className={styles.noMessages}>Send a message to start</div>
        ) : (
          <MessagesList
            messages={messages}
            isPartnerTyping={isPartnerTyping}
            selectedChat={selectedChat}
          />
        )}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Start a new message..."
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <img src={send} alt="Send" />
        </button>
      </div>
    </div>
  );
}
