import { useQueryClient } from "@tanstack/react-query";

export const useUpdateConversation = (defaultChatId) => {
  const queryClient = useQueryClient();

  const updateConversationInCache = (
    messageObj,
    chatId = defaultChatId,
    isCurrentChat = false
  ) => {
    if (!chatId || !messageObj) return;

    queryClient.setQueryData(["conversations"], (oldData) => {
      if (!oldData) {
        oldData = { conversations: [] };
      }

      const conversations = [...(oldData.conversations || [])];

      // Find the conversation index
      const conversationIndex = conversations.findIndex(
        (conv) => conv.id === chatId
      );

      // Determine the partner (whoever is NOT the receiver, since receiver is current user)
      const partner =
        messageObj.sender.id === messageObj.receiver.id
          ? messageObj.receiver
          : messageObj.sender;

      if (conversationIndex !== -1) {
        // Conversation exists - update it
        const updatedConversation = {
          ...conversations[conversationIndex],
          lastMessage: {
            id: messageObj.id,
            content: messageObj.content,
            createdAt: messageObj.createdAt,
            sender: messageObj.sender,
            receiver: messageObj.receiver,
          },
          // Set isRead to false only if we're NOT in the chat
          isRead: isCurrentChat ? true : false,
        };

        // Remove from current position
        conversations.splice(conversationIndex, 1);

        // Add to the beginning
        conversations.unshift(updatedConversation);
      } else {
        // Conversation doesn't exist - create it optimistically
        const newConversation = {
          id: chatId,
          partnerId: partner.id,
          partner: {
            id: partner.id,
            name: partner.name,
            username: partner.username,
            profilePicture: partner.profilePicture,
          },
          lastMessage: {
            id: messageObj.id,
            content: messageObj.content,
            createdAt: messageObj.createdAt,
            sender: messageObj.sender,
            receiver: messageObj.receiver,
          },
          // New conversations are always unread (unless we're somehow in the chat already)
          isRead: isCurrentChat ? true : false,
        };

        // Add to the beginning
        conversations.unshift(newConversation);
      }

      return {
        ...oldData,
        conversations,
      };
    });
  };

  return { updateConversationInCache };
};
