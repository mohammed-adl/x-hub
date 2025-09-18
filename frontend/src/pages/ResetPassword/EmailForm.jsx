import { handleSendPasscode } from "../../fetchers/auth";
import styles from "./ResetPassword.module.css";

export default function EmailForm({
  error,
  setError,
  loading,
  setLoading,
  formData,
  handleChange,
  onSuccess,
}) {
  return (
    <div className={styles.resetpwContainer}>
      <div className={styles.resetpwBox}>
        <h2>Find your X account</h2>

        <p>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          disabled={loading}
        />

        <button
          disabled={loading}
          onClick={async () => {
            setError("");
            setLoading(true);

            try {
              await handleSendPasscode({ email: formData.email });
              onSuccess();
            } catch (err) {
              setError(err.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Sending..." : "Next"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
