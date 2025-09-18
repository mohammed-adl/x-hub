import { handleResetPassword } from "../../fetchers";
import styles from "./ResetPassword.module.css";

export default function ResetPasswordForm({
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
        <h2>Enter your new password</h2>

        <input
          name="newPassword"
          id="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
          value={formData.newPassword}
          disabled={loading}
        />

        <input
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          onChange={handleChange}
          value={formData.confirmPassword}
          disabled={loading}
        />

        <button
          disabled={loading}
          onClick={async () => {
            setError("");
            setLoading(true);

            try {
              await handleResetPassword(formData);
              onSuccess();
            } catch (err) {
              setError(err.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
