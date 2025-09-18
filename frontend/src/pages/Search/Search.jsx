import UsersFeed from "./UsersFeed";
import { BackButton } from "../../components/ui";
import styles from "./Search.module.css";

export default function Search() {
  return (
    <div className={styles.usersContainer}>
      <div className={styles.headingBox}>
        <BackButton />
        <h1 className={styles.title}>People</h1>
      </div>
      <UsersFeed />
    </div>
  );
}
