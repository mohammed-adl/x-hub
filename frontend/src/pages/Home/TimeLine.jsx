import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import TweetCard from "../../components/TweetCard/TweetCard";
import { Spinner, ErrorMessage } from "../../components/ui";

import { mapTweetToProps } from "../../utils";
import { handleGetTimeLine } from "../../fetchers";

export default function TimeLine() {
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["tweets"],
    queryFn: async ({ pageParam = 0 }) => {
      return await handleGetTimeLine({ limit: 20, cursor: pageParam });
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor;
    },
  });
  const tweets = data?.pages?.flatMap((page) => page.tweets);

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
    <div>
      {tweets?.map((tweet) => (
        <TweetCard key={tweet.id} {...mapTweetToProps(tweet)} />
      ))}
      {isFetchingNextPage && <div className="spinner" />}
    </div>
  );
}
