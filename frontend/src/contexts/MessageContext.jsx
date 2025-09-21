import React, { createContext, useState, useEffect, useContext } from "react";
import { socket } from "../socket";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [isTyping, setIsTyping] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(new Set());
  const [selectedChat, setSelectedChat] = useState({});

  useEffect(() => {
    if (!selectedChat?.id) return;

    if (isTyping) {
      socket.emit("typing", {
        chatId: selectedChat.id,
        partnerId: selectedChat.partnerId,
      });
    } else {
      socket.emit("stopTyping", {
        chatId: selectedChat.id,
        partnerId: selectedChat.partnerId,
      });
    }

    return () => {
      socket.emit("stopTyping", {
        chatId: selectedChat.id,
        partnerId: selectedChat.partnerId,
      });
    };
  }, [isTyping, selectedChat]);

  useEffect(() => {
    const handlePartnerTyping = ({ chatId }) => {
      console.log("partnerTyping", chatId);
      setIsPartnerTyping((prev) => new Set(prev).add(chatId));
    };

    const handlePartnerStopTyping = ({ chatId }) => {
      setIsPartnerTyping((prev) => {
        const updated = new Set(prev);
        updated.delete(chatId); // remove instead of add
        return updated;
      });
    };

    socket.on("partnerTyping", handlePartnerTyping);
    socket.on("partnerStopTyping", handlePartnerStopTyping);

    return () => {
      socket.off("partnerTyping", handlePartnerTyping);
      socket.off("partnerStopTyping", handlePartnerStopTyping);
    };
  }, []);

  const value = {
    isTyping,
    setIsTyping,
    selectedChat,
    setSelectedChat,
    isPartnerTyping,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
