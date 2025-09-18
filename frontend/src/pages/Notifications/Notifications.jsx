import NewsFeed from "./NewsFeed";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../components/ui";
import styles from "./Notifications.module.css";

export default function Notifications() {
  const navigate = useNavigate();
  return (
    <section className={styles.notificationsPage}>
      <div className={styles.headingBox}>
        <BackButton onClick={() => navigate(-1)} />
        <h1 className={styles.heading}>Notifications</h1>
      </div>
      <div className={styles.newsFeed}>
        <NewsFeed />
      </div>
    </section>
  );
}
