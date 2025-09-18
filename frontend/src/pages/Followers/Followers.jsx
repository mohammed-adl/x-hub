import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Spinner, ErrorMessage } from "../../components/ui";
import { handleGetFollowers } from "../../fetchers";
import { FollowHeader, FollowCard } from "../../components";

export default function Followers() {
  const { username } = useParams();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["followers", username],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        return await handleGetFollowers({
          username,
          cursor: pageParam,
          limit: 20,
        });
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    retry: 1,
  });
  const followers = data?.pages?.flatMap((page) => page.followers) || [];

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
    <>
      <FollowHeader />
      <ul>
        {followers.map((user) => (
          <FollowCard key={user.id} user={user} />
        ))}
      </ul>
    </>
  );
}
