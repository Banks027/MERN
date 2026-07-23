import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (email.trim() === "") {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage(
      "If an account exists with this email, reset instructions will be sent."
    );
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
              ACCOUNT RECOVERY
            </p>

            <h2>
              Reset Your <span>Password.</span>
            </h2>

            <p>
              Enter the email connected to your account
              and we will help you regain access.
            </p>
          </div>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span>✓</span>
              <p>Secure password recovery</p>
            </div>

            <div className="auth-benefit">
              <span>✓</span>
              <p>Quick email instructions</p>
            </div>

            <div className="auth-benefit">
              <span>✓</span>
              <p>Return to your account</p>
            </div>
          </div>

          <div className="auth-visual-footer">
            Built by Knights for Knights
          </div>
        </div>

        <div className="auth-panel">
          <section className="auth-card">
            <div className="auth-icon">♞</div>

            <h1>Forgot Password?</h1>

            <p className="auth-subtitle">
              Enter the email connected to your account
              and we will send reset instructions.
            </p>

            {message && (
              <p
                className="auth-error"
                role="status"
              >
                {message}
              </p>
            )}

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="forgot-email">
                  Email
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                  }}
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
              >
                Send Reset Link
              </button>
            </form>

            <p className="auth-switch">
              <Link to="/login">
                ← Back to Login
              </Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default ForgotPassword;
