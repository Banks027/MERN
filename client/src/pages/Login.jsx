import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../styles/Login.css";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  /*
    Normal login:
    sends the user to the dashboard.

    Login from a protected listing action:
    sends the user back to the page they came from.
  */
  const destination =
    location.state?.from || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setErrorMessage(
        "Please enter your email and password."
      );
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      const authenticatedUser =
        data.user ?? data;

      login(authenticatedUser);

      navigate(destination, {
        replace: true,
        state: {
          listingId: location.state?.listingId,
          action: location.state?.action,
        },
      });
    } catch (error) {
      if (error.code === "EMAIL_NOT_VERIFIED") {
        sessionStorage.setItem(
          "pendingRegistrationEmail",
          email
        );

        navigate("/verify-email", {
          state: {
            email,
            from: destination,
            listingId: location.state?.listingId,
            action: location.state?.action,
          },
        });

        return;
      }

      setErrorMessage(
        error.message || "Unable to sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-layout">
        <div className="auth-visual">
          <div className="auth-brand">
            Knight<span>Marketplace</span>
          </div>

          <div className="auth-visual-content">
            <p className="auth-eyebrow">
              STUDENT MARKETPLACE
            </p>

            <h2>
              Welcome Back, <span>Knight.</span>
            </h2>

            <p>
              Sign in to browse listings, post items,
              message sellers, and connect with the
              student community.
            </p>
          </div>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span>✓</span>
              <p>Browse student listings</p>
            </div>

            <div className="auth-benefit">
              <span>✓</span>
              <p>Buy and sell securely</p>
            </div>

            <div className="auth-benefit">
              <span>✓</span>
              <p>Message sellers directly</p>
            </div>
          </div>

          <div className="auth-visual-footer">
            Built by Knights for Knights
          </div>
        </div>

        <div className="auth-panel">
          <section className="auth-card">
            <div className="auth-icon">♞</div>

            <h1>Sign In</h1>

            <p className="auth-subtitle">
              Enter your account information to continue
              to Knight Marketplace.
            </p>

            {errorMessage && (
              <p
                className="auth-error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password-button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                  >
                    Forgot Password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="google-button-wrapper">
              <GoogleAuthButton
                width="354"
                destination={destination}
                navigate={navigate}
                location={location}
                onErrorMessage={setErrorMessage}
              />
            </div>

            <p className="auth-switch">
              Do not have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Login;
