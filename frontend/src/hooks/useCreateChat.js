import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { handleCreateChat } from "../fetchers";

export function useCreateChat(username, setUsername, setSelectedChat) {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [body, setBody] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!username) {
      setIsComplete(true);
      return;
    }

    setIsCreating(true);
    setIsComplete(false);

    (async () => {
      try {
        console.log("Creating chat...");
        const body = await handleCreateChat(username);
        setBody(body);

        setSelectedChat({ id: body.chat.id, partner: body.partner });

        // Add the new conversation to the cache
        queryClient.setQueryData(["conversations"], (oldData) => {
          if (!oldData) {
            return {
              conversations: [
                {
                  id: body.chat.id,
                  partner: body.partner,
                  lastMessage: null, // No messages yet
                  updatedAt: new Date().toISOString(),
                },
              ],
            };
          }

          // Check if conversation already exists to avoid duplicates
          const existingConv = oldData.conversations?.find(
            (conv) => conv.id === body.chat.id
          );
          if (existingConv) {
            return oldData;
          }

          // Add new conversation at the beginning
          const newConversation = {
            id: body.chat.id,
            partner: body.partner,
            lastMessage: null,
            updatedAt: new Date().toISOString(),
          };

          return {
            ...oldData,
            conversations: [newConversation, ...(oldData.conversations || [])],
          };
        });

        setIsComplete(true);
      } catch (error) {
        console.error("Error creating chat:", error);
        setIsComplete(true);
      } finally {
        setIsCreating(false);
        setUsername(null);
      }
    })();
  }, [username, setSelectedChat, setUsername, queryClient]);

  return { isCreating, isComplete, body };
}
