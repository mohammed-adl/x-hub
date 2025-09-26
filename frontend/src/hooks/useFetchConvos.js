import { useQuery } from "@tanstack/react-query";
import { handleGetAllConvos } from "../fetchers";

export function useFetchConvos(chatCreated = true) {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: handleGetAllConvos,
    retry: 3,
    staleTime: 60000,
    enabled: chatCreated,
  });
}
