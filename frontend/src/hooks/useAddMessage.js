// hooks/useAddMessage.js
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts";
import { handleSendMessage } from "../fetchers";

export const useAddMessage = (chatId, partnerId) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const addMessageToCache = (messageObj) => {
    if (!chatId) return;

    queryClient.setQueryData(["chat", chatId], (oldData) => {
      // If no old data, create the initial structure
      if (!oldData?.pages?.length) {
        return {
          pages: [{ messages: [messageObj], nextCursor: null }],
          pageParams: [0],
        };
      }

      const newPages = [...oldData.pages];
      const firstPage = { ...newPages[0] };

      // Ensure firstPage.messages is always an array
      firstPage.messages = Array.isArray(firstPage.messages)
        ? [messageObj, ...firstPage.messages]
        : [messageObj];

      newPages[0] = firstPage;

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const sendMessage = async (content) => {
    if (!chatId || !partnerId || !content.trim()) return;
    console.log(content);

    const messageContent = content.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic message
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
      receiver: { id: partnerId },
      isOptimistic: true,
    };

    // Add immediately to cache
    addMessageToCache(optimisticMessage);

    try {
      // Send to server
      await handleSendMessage(chatId, partnerId, messageContent);
      // Do nothing on success - keep the optimistic message
    } catch (error) {
      // Remove optimistic message on error
      queryClient.setQueryData(["chat", chatId], (oldData) => {
        if (!oldData?.pages?.length) return oldData;
        const newPages = [...oldData.pages];
        const firstPage = { ...newPages[0] };
        firstPage.messages = firstPage.messages.filter(
          (msg) => msg.id !== tempId
        );
        newPages[0] = firstPage;
        return { ...oldData, pages: newPages };
      });
      console.error("Failed to send message:", error);
    }
  };

  return { sendMessage };
};
