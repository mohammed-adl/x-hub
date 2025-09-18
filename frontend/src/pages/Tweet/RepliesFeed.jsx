import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { TweetCard } from "../../components";
import { Spinner, ErrorMessage } from "../../components/ui";
import { mapTweetToProps } from "../../utils";
import { handleGetReplies } from "../../fetchers";
import styles from "./Tweet.module.css";

export default function RepliesFeed({ tweetId }) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["replies", tweetId],
    queryFn: async ({ pageParam = 0 }) => {
      return await handleGetReplies({
        tweetId,
        limit: 20,
        cursor: pageParam,
      });
    },
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor,
  });

  const replies = data?.pages?.flatMap((page) => page.replies) || [];

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

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className={styles.repliesFeed}>
      {replies.map((reply) => (
        <TweetCard key={reply.id} {...mapTweetToProps(reply)} />
      ))}
    </div>
  );
}
