import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Spinner, ErrorMessage } from "../../components/ui";
import { handleGetTweets } from "../../fetchers";
import { TweetCard } from "../../components";
import { mapTweetToProps } from "../../utils";
import styles from "./Profile.module.css";

export default function TweetsFeed({ username }) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["tweets", username],
    queryFn: async ({ pageParam = 0 }) => {
      return await handleGetTweets({ limit: 20, cursor: pageParam, username });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });

  const tweets = data?.pages?.flatMap((page) => page.tweets) || [];

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
    <div className={styles.tweetsFeed}>
      {tweets.length === 0 && (
        <div className={styles.noTweets}>No tweets yet</div>
      )}
      {tweets.map((tweet) => (
        <TweetCard {...mapTweetToProps(tweet)} />
      ))}
    </div>
  );
}
