import { useEffect, useState } from "react";
import { handleCreateChat } from "../fetchers";

export function useCreateChat(username, setUsername, setSelectedChat) {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [body, setBody] = useState(null);

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

        setIsComplete(true);
      } catch (error) {
        console.error("Error creating chat:", error);
        setIsComplete(true);
      } finally {
        setIsCreating(false);
        setUsername(null);
      }
    })();
  }, [username, setSelectedChat, setUsername]);

  return { isCreating, isComplete, body };
}
