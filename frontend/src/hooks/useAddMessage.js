// hooks/useAddMessage.js
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts";

export const useAddMessage = (chatId) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const addMessage = (messageData) => {
    if (!chatId) return;

    const newMessageObj = {
      id: messageData.id || `temp-${Date.now()}`,
      content: messageData.content || messageData,
      createdAt: messageData.createdAt || new Date().toISOString(),
      sender: messageData.sender || {
        id: user.id,
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
      },
      receiver: messageData.receiver || null,
      isOptimistic: messageData.isOptimistic || false,
    };

    queryClient.setQueryData(["chat", chatId], (oldData) => {
      if (!oldData?.pages?.length) {
        return {
          pages: [{ chat: [newMessageObj], nextCursor: null }],
          pageParams: [0],
        };
      }

      const newPages = [...oldData.pages];
      const firstPage = { ...newPages[0] };
      firstPage.chat = [newMessageObj, ...firstPage.chat];
      newPages[0] = firstPage;

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const removeOptimisticMessage = (tempId) => {
    queryClient.setQueryData(["chat", chatId], (oldData) => {
      if (!oldData?.pages?.length) return oldData;

      const newPages = oldData.pages.map((page) => ({
        ...page,
        chat: page.chat.filter((msg) => msg.id !== tempId),
      }));

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  const updateMessage = (tempId, updatedMessage) => {
    queryClient.setQueryData(["chat", chatId], (oldData) => {
      if (!oldData?.pages?.length) return oldData;

      const newPages = oldData.pages.map((page) => ({
        ...page,
        chat: page.chat.map((msg) =>
          msg.id === tempId
            ? { ...msg, ...updatedMessage, isOptimistic: false }
            : msg
        ),
      }));

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  return { addMessage, removeOptimisticMessage, updateMessage };
};
