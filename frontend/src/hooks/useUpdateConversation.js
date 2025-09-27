import { useQueryClient } from "@tanstack/react-query";

export const useUpdateConversation = (defaultChatId) => {
  const queryClient = useQueryClient();

  const updateConversationInCache = (messageObj, chatId = defaultChatId) => {
    if (!chatId || !messageObj) return;

    queryClient.setQueryData(["conversations"], (oldData) => {
      if (!oldData?.conversations?.length) return oldData;

      const conversations = [...oldData.conversations];

      // Find the conversation to update
      const conversationIndex = conversations.findIndex(
        (conv) => conv.id === chatId
      );

      if (conversationIndex === -1) return oldData;

      // Update the conversation with the new last message
      const updatedConversation = {
        ...conversations[conversationIndex],
        lastMessage: {
          content: messageObj.content,
          createdAt: messageObj.createdAt,
          sender: messageObj.sender,
        },
        // Update the conversation's timestamp to sort properly
        updatedAt: messageObj.createdAt,
      };

      // Remove the conversation from its current position
      conversations.splice(conversationIndex, 1);

      // Add it to the beginning (most recent)
      conversations.unshift(updatedConversation);

      return {
        ...oldData,
        conversations,
      };
    });
  };

  return { updateConversationInCache };
};
