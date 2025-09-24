import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import PostReply from "./PostReply.jsx";
import RepliesFeed from "./RepliesFeed.jsx";
import { TweetCard } from "../../components";
import { Spinner, ErrorMessage, BackButton } from "../../components/ui";

import { handleGetTweet } from "../../fetchers";
import { mapTweetToProps } from "../../utils";

import styles from "./Tweet.module.css";

export default function Tweet() {
  const { id: tweetId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tweet", tweetId],
    queryFn: () => handleGetTweet(tweetId),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const tweet = data?.tweet;

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className={styles.tweetContainer}>
      <div className={styles.tweetCard}>
        <div className={styles.tweetHeader}>
          <BackButton />
          <h2 className={styles.tweetTitle}>Post</h2>
        </div>
        <TweetCard {...mapTweetToProps(tweet)} />
      </div>
      <div className={styles.repliesContainer}>
        <PostReply tweetId={tweet.id} profilePicture={tweet.profilePicture} />
        <RepliesFeed tweetId={tweet.id} />
      </div>
    </div>
  );
}
