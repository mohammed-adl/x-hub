import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  use,
} from "react";
import { socket } from "../socket";
import { useAddMessage, useUpdateConversation } from "../hooks";
import { handleMarkMessagesAsRead } from "../fetchers";
import { scrollToBottom } from "../utils";
import { useUser } from "./UserContext.jsx";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const { user, setUser } = useUser();
  const [isTyping, setIsTyping] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(
    user?.hasUnreadMessages
  );

  const { addMessageToCache } = useAddMessage(
    selectedChat?.id,
    selectedChat?.partner?.id
  );
  const { updateConversationInCache } = useUpdateConversation(selectedChat?.id);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "user" && event.newValue) {
        const user = JSON.parse(event.newValue);
        if (user.hasUnreadMessages === false) {
          setUser({ ...user, hasUnreadMessages: false });
          setHasUnreadMessages(false);
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setUser]);

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

  useEffect(() => {
    socket.on("newMessage", ({ chatId, message }) => {
      updateConversationInCache(message, chatId); // always first
      setIsPartnerTyping(false);
      console.log("message");

      if (chatId === selectedChat?.id) {
        addMessageToCache(message);
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      } else {
        setUser((prev) => ({ ...prev, hasUnreadMessages: true }));
        setHasUnreadMessages(true);
        console.log(hasUnreadMessages);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedChat?.id, addMessageToCache, updateConversationInCache]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    const markAsRead = async () => {
      try {
        await handleMarkMessagesAsRead(selectedChat.id);
      } catch (err) {
        console.error("Failed to mark messages as read:", err);
      }
    };

    markAsRead();
  }, [selectedChat?.id]);

  return (
    <MessageContext.Provider
      value={{
        isTyping,
        setIsTyping,
        selectedChat,
        setSelectedChat,
        isPartnerTyping,
        hasUnreadMessages,
        setHasUnreadMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
