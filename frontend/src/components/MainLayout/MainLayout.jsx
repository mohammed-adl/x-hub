import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar.jsx";
import ExploreBar from "../ExploreBar/ExploreBar.jsx";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  const location = useLocation();

  const hideAside = location.pathname.startsWith("/messages");

  return (
    <div className={styles.mainLayout}>
      <header className={styles.navBar}>
        <NavBar />
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {!hideAside && (
        <aside className={styles.exploreBar}>
          <ExploreBar />
        </aside>
      )}
    </div>
  );
}
