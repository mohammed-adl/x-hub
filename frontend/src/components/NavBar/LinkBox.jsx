import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function LinkBox({
  value,
  src,
  navLink,
  hasNotification,
  hasUnreadMessages,
  onClick,
}) {
  return (
    <li className={styles.listItem} onClick={onClick}>
      <Link to={navLink}>
        <div className={styles.linkBox}>
          <div className={styles.iconBox}>
            <img src={src} className={styles.icon} />
            {hasNotification && <span className={styles.redDot}></span>}
            {hasUnreadMessages && (
              <span className={styles.messagesRedDot}></span>
            )}
          </div>
          <div>{value}</div>
        </div>
      </Link>
    </li>
  );
}
