import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import { handleGetChat } from "../../fetchers";
import { useUser, useMessage } from "../../contexts";

import {
  useAddMessage,
  useChatScroll,
  useTyping,
  useUpdateConversation,
} from "../../hooks";

import { send } from "../../assets/icons";
import MessagesList from "./MessagesList";
import { Spinner, ErrorMessage, Avatar } from "../../components/ui";
import { ALL_EMOJIS } from "./emojis";
import styles from "./Messages.module.css";

export default function ChatArea({ onBack }) {
  const { selectedChat, setIsTyping, isPartnerTyping } = useMessage();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const chatId = selectedChat?.id;
  const partnerId = selectedChat?.partner.id;

  const {
    data,
    isLoading,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chat", chatId],
    queryFn: ({ pageParam = 0 }) =>
      handleGetChat({ limit: 20, cursor: pageParam, chatId }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!chatId,
    retry: 3,
    staleTime: 30000,
  });

  const messages = data?.pages.flatMap((p) => p.messages || []) || [];

  const { containerRef: messagesContainerRef, scrollToBottom } = useChatScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    messages,
    chatId,
  });

  const {
    value: newMessage,
    handleChange: handleTyping,
    setValue: setNewMessage,
  } = useTyping(setIsTyping);

  const { sendMessage } = useAddMessage(chatId, partnerId);
  const { updateConversationInCache } = useUpdateConversation(chatId);

  const handleSend = useCallback(async () => {
    if (!newMessage.trim()) return;

    const messageToSend = newMessage;
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: messageToSend,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    };

    setNewMessage("");
    setShowEmojiPicker(false);
    updateConversationInCache(optimisticMessage);
    sendMessage(messageToSend);
    setTimeout(() => scrollToBottom(), 0);
  }, [
    newMessage,
    sendMessage,
    setNewMessage,
    scrollToBottom,
    updateConversationInCache,
    user.id,
    user.name,
    user.username,
    user.profilePicture,
  ]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleEmojiClick = useCallback(
    (emoji) => {
      setNewMessage((prev) => prev + emoji);
    },
    [setNewMessage]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [chatId, scrollToBottom, messages.length]);

  if (isLoading) return <Spinner />;
  if (queryError) return <ErrorMessage message={"something went wrong"} />;

  return (
    <div className={styles.chatArea}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ←
        </button>
        <Avatar
          src={selectedChat?.partner.profilePicture}
          name={selectedChat?.partner.name}
          size={35}
          onClick={() => navigate(`/${selectedChat?.partner.username}`)}
        />
        <div className={styles.partner}>{selectedChat?.partner.name}</div>
      </div>
      <div
        className={styles.messages}
        ref={messagesContainerRef}
        data-messages-container
      >
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
        <div className={styles.emojiPickerWrapper} ref={emojiPickerRef}>
          <button
            className={styles.emojiButton}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            type="button"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              {ALL_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  className={styles.emojiOption}
                  onClick={() => handleEmojiClick(emoji)}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Start a new message..."
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend} disabled={!newMessage.trim()}>
          <img src={send} alt="Send" />
        </button>
      </div>
    </div>
  );
}
