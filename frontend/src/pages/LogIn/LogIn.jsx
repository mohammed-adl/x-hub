import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUser } from "../../contexts";
import { handleLogIn } from "../../fetchers";
import { logInSchema } from "../../schemas";
import authService from "../../services/authService";
import XLogo from "../../assets/XLogo.svg";
import styles from "./LogIn.module.css";

export default function LogIn() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(logInSchema),
  });

  async function submit(formData) {
    setLoading(true);
    setServerError(null);

    try {
      const data = await handleLogIn(formData);
      authService.setTokens(data);
      const { user } = data;
      setUser(user);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.signinContainer}>
      <div className={styles.topBarDesktop}>
        <img src={XLogo} alt="Logo" className={styles.logo} />
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className={styles.signupButton}
        >
          Sign Up
        </button>
      </div>

      <div className={styles.signinBox}>
        <div className={styles.topBarMobile}>
          <img src={XLogo} alt="Logo" className={styles.logo} />
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className={styles.signupButton}
          >
            Sign Up
          </button>
        </div>

        <div className={styles.header}>
          <h1 className={styles.headingTitle}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(submit)}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              disabled={loading}
              className={styles.input}
              {...register("email")}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              disabled={loading}
              className={styles.input}
              {...register("password")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? <div className={styles.spinner} /> : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            className={styles.secondaryButton}
          >
            Forgot Password?
          </button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <p className={styles.signupPrompt}>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.link}>
              Create one
            </Link>
          </p>

          {(serverError ||
            errors.email?.message ||
            errors.password?.message) && (
            <p className={styles.error}>
              {serverError || errors.email?.message || errors.password?.message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
