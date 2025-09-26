import { useInfiniteQuery } from "@tanstack/react-query";
import { handleGetChat } from "../fetchers";

export function useChatMessages(chatId) {
  const query = useInfiniteQuery({
    queryKey: ["chat", chatId],
    queryFn: ({ pageParam = 0 }) =>
      handleGetChat({ limit: 20, cursor: pageParam, chatId }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    enabled: !!chatId,
    retry: 3,
    staleTime: 30000, // 30 seconds
  });

  const messages = query.data?.pages.flatMap((p) => p.messages || []) || [];

  return { ...query, messages };
}
