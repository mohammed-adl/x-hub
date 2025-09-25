// components/Messages/ChatArea.js
import { useState, useRef, useEffect, useCallback } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

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
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const chatId = selectedChat?.id;
  const partnerId = selectedChat?.partnerId;
  const typingTimeoutRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const mounted = useRef(true);

  const { addMessage, removeOptimisticMessage, updateMessage } =
    useAddMessage(chatId);
  const queryClient = useQueryClient();

  // Cleanup on unmount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error: queryError,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chat", chatId],
    queryFn: ({ pageParam = 0 }) =>
      handleGetChat({ limit: 20, cursor: pageParam, chatId }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!chatId,
    retry: 3,
    staleTime: 30000, // 30 seconds
  });

  const messages = data?.pages.flatMap((p) => p.chat) || [];

  // Scroll handling for pagination
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearTop = scrollTop < 100;

    if (isNearTop) {
      const oldScrollHeight = scrollHeight;
      fetchNextPage().then(() => {
        if (mounted.current && container) {
          requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - oldScrollHeight;
          });
        }
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // Auto-scroll to bottom for new chats
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && messages.length > 0 && data?.pages?.length === 1) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, chatId, data?.pages?.length]);

  const handleTyping = useCallback(
    (value) => {
      setNewMessage(value);
      setError(null);
      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        if (mounted.current) {
          setIsTyping(false);
        }
      }, 1500);
    },
    [setIsTyping]
  );

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }, []);

  const updateConversationsList = useCallback(
    (messageObject) => {
      queryClient.setQueryData(["conversations"], (oldData) => {
        if (!oldData) return oldData;

        const updatedConversations = oldData.conversations.map((conv) => {
          if (conv.id === chatId) {
            return { ...conv, lastMessage: messageObject };
          }
          return conv;
        });

        const movedConversation = updatedConversations.find(
          (conv) => conv.id === chatId
        );
        const rest = updatedConversations.filter((conv) => conv.id !== chatId);

        return {
          ...oldData,
          conversations: [movedConversation, ...rest],
        };
      });
    },
    [queryClient, chatId]
  );

  const handleSend = async () => {
    if (!newMessage.trim() || isSending || !chatId || !partnerId) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    // Clear input immediately for better UX
    setNewMessage("");
    setIsTyping(false);
    setIsSending(true);
    setError(null);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Create optimistic message
    const optimisticMessage = {
      id: tempId,
      content: messageContent,
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
      isOptimistic: true,
    };

    // Add optimistic message
    addMessage(optimisticMessage);
    scrollToBottom();

    try {
      const response = await handleSendMessage(
        chatId,
        partnerId,
        messageContent
      );

      if (!mounted.current) return;

      const realMessage = {
        id: response.message.id,
        content: messageContent,
        createdAt: response.message.createdAt || new Date().toISOString(),
        sender: {
          id: user.id,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture,
        },
        receiver: {
          id: partnerId,
        },
        isOptimistic: false,
      };

      // Replace optimistic message with real one
      updateMessage(tempId, realMessage);
      updateConversationsList(realMessage);
    } catch (err) {
      console.error("Failed to send message:", err);

      if (!mounted.current) return;

      // Remove optimistic message and show error
      removeOptimisticMessage(tempId);
      setError("Failed to send message. Please try again.");
      setNewMessage(messageContent); // Restore message content
    } finally {
      if (mounted.current) {
        setIsSending(false);
      }
    }
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (isLoading) return <Spinner />;
  if (queryError) return <ErrorMessage message={queryError.message} />;

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

      {error && (
        <div className={styles.errorBar}>
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Start a new message..."
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <button
          onClick={handleSend}
          disabled={isSending || !newMessage.trim()}
          className={isSending ? styles.sending : ""}
        >
          {isSending ? (
            <div className={styles.sendingSpinner} />
          ) : (
            <img src={send} alt="Send" />
          )}
        </button>
      </div>
    </div>
  );
}
