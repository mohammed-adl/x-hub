import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useMessage, useUser } from "../../contexts";
import { handleGetChat, handleSendMessage } from "../../fetchers";
import { useAddMessage } from "../../hooks/useAddMessage";

import { send } from "../../assets/icons";
import MessagesList from "./MessagesList";
import { Spinner, ErrorMessage } from "../../components/ui";
import styles from "./Messages.module.css";

export default function ChatArea() {
  const { setIsTyping, selectedChat, isPartnerTyping } = useMessage();
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");
  const chatId = selectedChat?.id;
  const partnerId = selectedChat?.partnerId;
  const typingTimeoutRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { addMessage } = useAddMessage(chatId);

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

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = container.scrollTop;
          const scrollHeight = container.scrollHeight;
          const clientHeight = container.clientHeight;

          const isNearTop = scrollTop < 100;

          if (isNearTop && hasNextPage && !isFetchingNextPage) {
            const oldScrollHeight = scrollHeight;
            fetchNextPage().then(() => {
              requestAnimationFrame(() => {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop = newScrollHeight - oldScrollHeight;
              });
            });
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && messages.length > 0 && !data?.pages?.length > 1) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, chatId]);

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

    const messageToSend = newMessage;
    setNewMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      const response = await handleSendMessage(
        chatId,
        partnerId,
        messageToSend
      );
      const messageObject = {
        id: response.message.id,
        content: messageToSend,
        createdAt: new Date().toISOString(),
        sender: {
          id: user.id,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture,
        },
        receiver: {
          id: partnerId,
        },
      };
      addMessage(messageObject);

      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 0);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className={styles.chatArea}>
      <div className={styles.messages} ref={messagesContainerRef}>
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
