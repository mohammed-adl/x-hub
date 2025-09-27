import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import TweetAction from "./TweetAction.jsx";
import { Avatar } from "../ui";

import { formatTimeShort, formatTweetCounts } from "../../utils";
import { like, reply, retweet } from "../../assets/icons/index.js";
import { handleLikeTweet, handleRetweet } from "../../fetchers";
import styles from "./TweetCard.module.css";

export default function TweetCard({
  tweetId,
  name,
  username,
  content,
  date,
  likesCount,
  repliesCount,
  retweetsCount,
  originalTweetId,
  originalTweet,
  parentTweetId,
  profilePicture,
  isLiked,
  isRetweeted,
  tweetMedia,
}) {
  const queryClient = useQueryClient();

  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikesCount] = useState(likesCount);
  const [retweeted, setRetweeted] = useState(isRetweeted);
  const [retweets, setRetweetsCount] = useState(retweetsCount);
  const navigate = useNavigate();

  function handleNavigation(e, username) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${username}`);
  }

  async function actionsHandler(type) {
    try {
      switch (type) {
        case "like":
          await likeTweet();
          break;
        case "retweet":
          await retweetTweet();
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function likeTweet() {
    try {
      await handleLikeTweet(tweetId);
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch {
      console.log("error");
    }
  }

  async function retweetTweet() {
    try {
      await handleRetweet(tweetId);
      queryClient.invalidateQueries(["tweet", tweetId]);
      setRetweeted((prev) => !prev);
      setRetweetsCount((prev) => (retweeted ? prev - 1 : prev + 1));
    } catch {
      console.log("error");
    }
  }

  const displayTweet =
    originalTweetId && originalTweet
      ? originalTweet
      : {
          content,
          user: { name, username, profilePicture },
          tweetMedia,
          _count: {
            likes: likes,
            retweets: retweets,
            replies: repliesCount,
          },
          createdAt: date,
        };

  const tweetContent = (
    <article className={styles.tweetCard}>
      {originalTweetId && (
        <div className={styles.retweetSection}>
          <div className={styles.retweetInfo}>
            <img src={retweet} alt="retweet" />
            <span>{name} retweeted</span>
          </div>
        </div>
      )}

      <div className={styles.tweetWrapper}>
        <div
          className={styles.tweetAvatar}
          onClick={(e) => handleNavigation(e, displayTweet.user.username)}
        >
          <Avatar
            src={displayTweet.user.profilePicture}
            name={displayTweet.user.name}
            size={40}
          />
        </div>
        <div className={styles.tweetBox}>
          <div className={styles.headerWithIcon}>
            <div className={styles.tweetContent}>
              <div className={styles.tweetHeader}>
                <div className={styles.authorData}>
                  <div
                    className={styles.tweetAuthor}
                    onClick={(e) =>
                      handleNavigation(e, displayTweet.user.username)
                    }
                  >
                    {displayTweet.user.name}
                  </div>
                  <div className={styles.tweetUsername}>
                    @{displayTweet.user.username}
                  </div>
                  <div className={styles.tweetDot}>·</div>
                  <div className={styles.tweetDate}>
                    {formatTimeShort(displayTweet.createdAt)}
                  </div>
                </div>
              </div>
              <p className={styles.tweetText}>{displayTweet.content}</p>
              <div
                className={`${styles.mediaContainer} ${
                  displayTweet.tweetMedia?.length
                    ? styles[`mediaCount${displayTweet.tweetMedia.length}`]
                    : ""
                }`}
              >
                {displayTweet.tweetMedia?.map((media) => (
                  <img
                    key={media.path}
                    src={media.path}
                    alt={media.type}
                    className={styles.media}
                  />
                ))}
              </div>
            </div>
          </div>

          {!parentTweetId && (
            <div className={styles.tweetFooter}>
              <TweetAction
                src={like}
                count={formatTweetCounts(likes)}
                type="like"
                isActive={liked}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  actionsHandler("like");
                }}
              />
              <TweetAction
                src={retweet}
                count={formatTweetCounts(retweets)}
                type="retweet"
                isActive={retweeted}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  actionsHandler("retweet");
                }}
              />
              <TweetAction
                src={reply}
                count={formatTweetCounts(displayTweet._count.replies)}
                type="reply"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );

  return !parentTweetId ? (
    <Link to={`/tweet/${tweetId}`}>{tweetContent}</Link>
  ) : (
    tweetContent
  );
}
