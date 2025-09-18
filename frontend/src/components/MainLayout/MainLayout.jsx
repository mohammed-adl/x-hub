import { Outlet } from "react-router-dom";
import NavBar from "../NavBar/NavBar.jsx";
import ExploreBar from "../ExploreBar/ExploreBar.jsx";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <div className={styles.mainLayout}>
      <header className={styles.navBar}>
        <NavBar />
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <aside className={styles.exploreBar}>
        <ExploreBar />
      </aside>
    </div>
  );
}
