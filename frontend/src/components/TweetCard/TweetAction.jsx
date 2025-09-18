import styles from "../../components/TweetCard/TweetCard.module.css";

function TweetAction({ src, count, type, onClick, isActive }) {
  let activeClass = "";

  if (isActive && type === "like") {
    activeClass = styles.liked;
  } else if (isActive && type === "retweet") {
    activeClass = styles.retweeted;
  }

  return (
    <button className={`${styles.actionBox} ${activeClass}`} onClick={onClick}>
      <img src={src} alt={type} className={styles.actionIcon} />
      {<span className={styles.actionCount}>{count}</span>}
    </button>
  );
}

export default TweetAction;
