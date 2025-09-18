import styles from "./FollowHeader.module.css";
import { useUser } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import BackButton from "../ui/BackButton";

function FollowHeader() {
  const { user } = useUser();
  const { username, name } = user;
  return (
    <div className={styles.followHeader}>
      <div className={styles.userInfo}>
        <BackButton />
        <div className={styles.userMeta}>
          <h2 className={styles.fullName}>{name}</h2>
          <div className={styles.userName}>@{username}</div>
        </div>
      </div>

      <div className={styles.followNav}>
        <Link to={`/${username}/followers`} className={styles.navButton}>
          Followers
        </Link>
        <Link to={`/${username}/following`} className={styles.navButton}>
          Following
        </Link>
      </div>
    </div>
  );
}

export default FollowHeader;
