import { handleVerifyPasscode } from "../../fetchers/auth";
import styles from "./ResetPassword.module.css";

export default function VerifyCodeForm({
  error,
  setError,
  loading,
  setLoading,
  formData,
  onSuccess,
  handleChange,
}) {
  return (
    <div className={styles.resetpwContainer}>
      <div className={styles.resetpwBox}>
        <h2>We sent you a code</h2>

        <p>
          Check your email to get your confirmation code. If you need to request
          a new code, go back and reselect a confirmation.
        </p>

        <input
          name="passcode"
          id="passcode"
          type="number"
          placeholder="Enter your code"
          onChange={handleChange}
          value={formData.passcode}
          disabled={loading}
        />

        <button
          disabled={loading}
          onClick={async () => {
            setError("");
            setLoading(true);

            try {
              await handleVerifyPasscode({
                email: formData.email,
                passcode: formData.passcode,
              });
              onSuccess();
            } catch (err) {
              setError(err.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Verifying..." : "Next"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
