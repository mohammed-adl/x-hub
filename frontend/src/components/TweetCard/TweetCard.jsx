import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useUser } from "../../contexts";
import { formatTimeShort, formatTweetCounts } from "../../utils";
import { like, reply, retweet } from "../../assets/icons/index.js";
import { handleLikeTweet, handleRetweet } from "../../fetchers";

import { Avatar } from "../ui";
import TweetAction from "./TweetAction.jsx";
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
  const { user } = useUser();
  const { name: retweeterName, username: retweeterUsername } = user;
  const { username: profileUsername } = useParams();

  const [liked, setLiked] = useState(isLiked || false);
  const [likes, setLikesCount] = useState(likesCount || 0);

  const [retweeted, setRetweeted] = useState(isRetweeted || false);
  const [retweets, setRetweetsCount] = useState(retweetsCount || 0);
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(isLiked || false);
    setRetweeted(isRetweeted || false);
    setLikesCount(likesCount || 0);
    setRetweetsCount(retweetsCount || 0);
  }, [isLiked, isRetweeted, likesCount, retweetsCount]);

  function handleNavigation(e, username) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${username}`);
  }

  async function actionsHandler(type) {
    try {
      if (type === "like") {
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

        await handleLikeTweet(tweetId);
      }

      if (type === "retweet") {
        setRetweeted((prev) => !prev);
        setRetweetsCount((prev) => (retweeted ? prev - 1 : prev + 1));

        await handleRetweet(tweetId);
      }
    } catch (error) {
      if (type === "like") {
        setLiked(liked);
        setLikesCount(likes);
      }
      if (type === "retweet") {
        setRetweeted(retweeted);
        setRetweetsCount(retweets);
      }
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
            <span>
              {profileUsername === retweeterUsername ? "you" : retweeterName}{" "}
              retweeted
            </span>
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
              {displayTweet.content && (
                <p className={styles.tweetText}>{displayTweet.content}</p>
              )}
              {displayTweet.tweetMedia?.length > 0 && (
                <div
                  className={`${styles.mediaContainer} ${
                    displayTweet.tweetMedia.length
                      ? styles[`mediaCount${displayTweet.tweetMedia.length}`]
                      : ""
                  }`}
                >
                  {displayTweet.tweetMedia.map((media) => (
                    <img
                      key={media.path}
                      src={media.path}
                      alt={media.type}
                      className={styles.media}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          {!parentTweetId && (
            <div className={styles.tweetFooter}>
              <TweetAction
                src={like}
                count={formatTweetCounts(displayTweet._count.likes)}
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
                count={formatTweetCounts(displayTweet._count.retweets)}
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
