import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      const { sender, message } = data;
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, []);

  return (
    <MessageContext.Provider value={{ conversations, setConversations }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
