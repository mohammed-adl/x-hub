import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Spinner, ErrorMessage } from "../../components/ui";
import NotificationCard from "./NotificationCard";
import { handleGetNotifications } from "../../fetchers";

export default function NewsFeed() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        return await handleGetNotifications({ limit: 20, cursor: pageParam });
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const notifications =
    data?.pages?.flatMap((page) => page.notifications) || [];

  useEffect(() => {
    function onScroll() {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (nearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!notifications.length) return <div>You have no notifications</div>;

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return (
    <>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </>
  );
}
