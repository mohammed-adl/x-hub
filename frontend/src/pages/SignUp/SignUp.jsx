import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUser } from "../../contexts/UserContext.jsx";
import { handleSignUp } from "../../fetchers/auth.js";
import authService from "../../services/authService.js";
import { signUpSchema } from "../../schemas/index.js";
import XLogo from "../../assets/Xlogo.svg";
import styles from "./SignUp.module.css";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  async function submit(formData) {
    setLoading(true);
    setServerError(null);

    try {
      const data = await handleSignUp(formData);
      const { user } = data;
      authService.setTokens(data);
      setUser(user);
      navigate("/home");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.signUpContainer}>
      <div className={styles.topBarDesktop}>
        <img src={XLogo} alt="Logo" className={styles.logo} />
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={styles.switchButton}
        >
          Log In
        </button>
      </div>

      <div className={styles.topBarMobile}>
        <img src={XLogo} alt="Logo" className={styles.logo} />
      </div>

      <div className={styles.signUpBox}>
        <div className={styles.header}>
          <h1 className={styles.headingTitle}>Join us today</h1>
          <p className={styles.subtitle}>Create your free account</p>
        </div>

        <form
          className={styles.signupForm}
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <input
            type="text"
            placeholder="Name"
            className={styles.signupInput}
            {...register("name")}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.signupInput}
            {...register("email")}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.signupInput}
            {...register("password")}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.signupInput}
            {...register("confirmPassword")}
            disabled={loading}
          />

          <button
            className={styles.signupButton}
            type="submit"
            disabled={loading}
          >
            {loading ? <div className={styles.spinner} /> : "Create Account"}
          </button>

          {(errors.name?.message ||
            errors.email?.message ||
            errors.password?.message ||
            errors.confirmPassword?.message ||
            serverError) && (
            <p className={styles.error}>
              {errors.name?.message ||
                errors.email?.message ||
                errors.password?.message ||
                errors.confirmPassword?.message ||
                serverError}
            </p>
          )}

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <p className={styles.loginPrompt}>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
