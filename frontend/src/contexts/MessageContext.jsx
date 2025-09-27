import React, { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../socket";
import { useAddMessage, useUpdateConversation } from "../hooks";
import { scrollToBottom } from "../utils";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [isTyping, setIsTyping] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const { addMessageToCache } = useAddMessage(
    selectedChat?.id,
    selectedChat?.partner?.id
  );
  const { updateConversationInCache } = useUpdateConversation(selectedChat?.id);

  useEffect(() => {
    socket.on("newMessage", ({ chatId, message }) => {
      if (chatId !== selectedChat?.id) return;
      updateConversationInCache(message);
      addMessageToCache(message);
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedChat?.id, addMessageToCache]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    if (isTyping) {
      socket.emit("typing", {
        chatId: selectedChat.id,
        partnerId: selectedChat.partner.id,
      });
    } else {
      socket.emit("stopTyping", {
        chatId: selectedChat.id,
        partnerId: selectedChat.partner.id,
      });
    }

    return () => {
      socket.emit("stopTyping", {
        chatId: selectedChat.id,
        partnerId: selectedChat.partner.id,
      });
    };
  }, [isTyping, selectedChat]);

  useEffect(() => {
    const handlePartnerTyping = ({ chatId }) => {
      if (chatId !== selectedChat?.id) return;
      setIsPartnerTyping(true);
    };

    const handlePartnerStopTyping = ({ chatId }) => {
      if (chatId !== selectedChat?.id) return;
      setIsPartnerTyping(false);
    };

    socket.on("partnerTyping", handlePartnerTyping);
    socket.on("partnerStopTyping", handlePartnerStopTyping);

    return () => {
      socket.off("partnerTyping", handlePartnerTyping);
      socket.off("partnerStopTyping", handlePartnerStopTyping);
    };
  }, [selectedChat?.id]);

  return (
    <MessageContext.Provider
      value={{
        isTyping,
        setIsTyping,
        selectedChat,
        setSelectedChat,
        isPartnerTyping,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
