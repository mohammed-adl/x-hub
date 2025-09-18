import { useNavigate } from "react-router-dom";
import XLogo from "../../assets/XLogo.svg";
import styles from "./Auth.module.css";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <main className={styles.authContainer}>
      <div className={styles.authBox}>
        <div className={styles.authLogo}>
          <img src={XLogo} alt="X Icon" />
        </div>

        <section className={styles.authContent}>
          <h1 className={styles.authHeading}>
            Happening <span>Now</span>
          </h1>
          <h2 className={styles.authSubheading}>Join Today</h2>

          <button
            className={styles.authButton}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>

          <span className={styles.authDivider}>OR</span>

          <p className={styles.authLoginText}>Already have an account?</p>
          <button
            className={styles.authButton}
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </section>
      </div>
    </main>
  );
}
