import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts";

export const useAddMessage = (chatId) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const addMessage = (messageData) => {
    let newMessageObj;

    if (typeof messageData === "string") {
      newMessageObj = {
        id: Date.now(),
        content: messageData,
        sender: {
          id: user.id,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture,
        },
        createdAt: new Date().toISOString(),
      };
    } else {
      newMessageObj = messageData;
    }

    queryClient.setQueryData(["chat", chatId], (oldData) => {
      if (!oldData?.pages?.length) {
        return {
          pages: [{ chat: [newMessageObj], nextCursor: null }],
          pageParams: [0],
        };
      }

      const newPages = [...oldData.pages];
      newPages[0] = {
        ...newPages[0],
        chat: [newMessageObj, ...newPages[0].chat],
      };

      return {
        ...oldData,
        pages: newPages,
      };
    });
  };

  return { addMessage };
};
