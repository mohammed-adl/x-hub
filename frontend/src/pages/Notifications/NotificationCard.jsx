import { Link } from "react-router-dom";
import { Avatar } from "../../components/ui";

import { handleMarkAsViewed } from "../../fetchers";
import { formatTweetCounts, formatTimeAgo } from "../../utils";
import XLogo from "../../assets/XLogo.svg";
import styles from "./Notifications.module.css";

export default function NotificationCard({ notification }) {
  const type = notification.type;
  const sender = notification.fromUser?.name || "";
  const tweetContent = notification.tweet?.content || "";
  const tweetPath = `/tweet/${notification?.tweet?.id}`;
  const profilePath = `/${notification.fromUser?.username}`;
  const profilePicture =
    type === "WELCOME" ? XLogo : notification.fromUser?.profilePicture;
  const notificationId = notification?.id;
  const isViewed = notification.isViewed;
  const viewClass = `${styles.notificationBox} ${
    isViewed ? styles.viewedBox : styles.unViewedBox
  }`;
  const formattedDate = formatTimeAgo(notification.createdAt);

  async function markAsViewed(notificationId) {
    try {
      await handleMarkAsViewed(notificationId);
    } catch (err) {
      console.log(err);
    }
  }

  function getCountText(notification, includeTweet = true) {
    if (notification.type === "WELCOME") return "Welcome to X!";
    if (notification.type === "FOLLOW") return " followed you";

    const type = notification.type;
    let count;
    if (type === "LIKE") count = notification.tweet?._count.likes;
    else if (type === "RETWEET") count = notification.tweet?._count.retweets;

    const action = type === "LIKE" ? "liked" : "retweeted";
    if (count === 1)
      return ` ${action} your post${includeTweet ? ` "${tweetContent}"` : ""}`;
    if (count === 2)
      return ` and 1 other ${action} your post${
        includeTweet ? ` "${tweetContent}"` : ""
      }`;
    if (count > 1)
      return ` and ${formatTweetCounts(count)} others ${action} your post`;
  }

  return (
    <Link
      to={
        type === "WELCOME"
          ? profilePath
          : type === "FOLLOW"
          ? profilePath
          : tweetPath
      }
      key={notificationId}
      onClick={() => markAsViewed(notificationId)}
    >
      <div className={viewClass}>
        <Avatar src={profilePicture} name={sender} size={40} />
        <div className={styles.notificationContent}>
          <div className={styles.notificationHeader}>
            <div className={styles.notificationText}>
              <div>
                {type !== "WELCOME" && (
                  <strong className={styles.sender}>{sender}</strong>
                )}
                {getCountText(notification)}
              </div>
              {notification.tweet?.content && type !== "WELCOME" && (
                <div className={styles.tweetText}>
                  {notification.tweet.content.length > 80
                    ? notification.tweet.content.slice(0, 80) + "..."
                    : notification.tweet.content}
                </div>
              )}
            </div>
            <span className={styles.eventDate}>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
