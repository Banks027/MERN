import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../styles/VerifyEmail.css";
import { verifyEmail } from "../api/authApi";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    sessionStorage.getItem(
      "pendingRegistrationEmail"
    ) ||
    "";

  const firstName =
    location.state?.firstName || "";

  const destination =
    location.state?.from || "/dashboard";

  const [verificationCode, setVerificationCode] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!email) {
      setErrorMessage(
        "No email address was provided. Please register again."
      );
    }
  }, [email]);

  function handleCodeChange(event) {
    const digitsOnly = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setVerificationCode(digitsOnly);
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email) {
      setErrorMessage(
        "No email address was provided. Please register again."
      );
      return;
    }

    if (verificationCode.length !== 6) {
      setErrorMessage(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await verifyEmail({
        email,
        verificationCode,
      });

      sessionStorage.removeItem(
        "pendingRegistrationEmail"
      );

      setSuccessMessage(
        "Your email has been verified. Redirecting you to sign in..."
      );

      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            email,
            verificationSuccess: true,
            from: destination,
            listingId: location.state?.listingId,
            action: location.state?.action,
          },
        });
      }, 1200);
    } catch (error) {
      if (
        error.code === "INVALID_VERIFICATION_CODE"
      ) {
        setErrorMessage(
          "That verification code is incorrect."
        );
        return;
      }

      if (
        error.code === "VERIFICATION_CODE_EXPIRED"
      ) {
        setErrorMessage(
          "That verification code has expired."
        );
        return;
      }

      if (error.code === "USER_NOT_FOUND") {
        setErrorMessage(
          "We could not find an account for this email address."
        );
        return;
      }

      if (error.code === "EMAIL_ALREADY_VERIFIED") {
        sessionStorage.removeItem(
          "pendingRegistrationEmail"
        );

        setSuccessMessage(
          "This email has already been verified. Redirecting you to sign in..."
        );

        window.setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              email,
              from: destination,
            },
          });
        }, 1200);

        return;
      }

      setErrorMessage(
        error.message ||
          "Unable to verify your email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="verify-email-page">
      <section className="verify-email-card">
        <div className="verify-email-header">
          <div
            className="verify-email-icon"
            aria-hidden="true"
          >
            ✉
          </div>

          <h1>Verify Your Email</h1>

          <p>
            {firstName
              ? `Almost there, ${firstName}.`
              : "Almost there."}{" "}
            Enter the verification code we sent to:
          </p>

          {email && (
            <p className="verify-email-address">
              {email}
            </p>
          )}
        </div>

        {errorMessage && (
          <p
            className="verify-email-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p
            className="verify-email-success"
            role="status"
          >
            {successMessage}
          </p>
        )}

        <form
          className="verify-email-form"
          onSubmit={handleSubmit}
        >
          <div className="verify-email-form-group">
            <label htmlFor="verificationCode">
              Verification Code
            </label>

            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={verificationCode}
              onChange={handleCodeChange}
              maxLength={6}
              disabled={
                isSubmitting || Boolean(successMessage)
              }
              aria-describedby="verification-help"
              autoFocus
            />

            <small id="verification-help">
              Enter the 6-digit code from your email.
              The code expires after 10 minutes.
            </small>
          </div>

          <button
            type="submit"
            className="verify-email-button"
            disabled={
              isSubmitting ||
              Boolean(successMessage) ||
              !email
            }
          >
            {isSubmitting
              ? "Verifying..."
              : "Verify Email"}
          </button>
        </form>

        <p className="verify-email-note">
          Did not receive the code? Check your spam
          folder. We will add a resend option next.
        </p>

        <p className="verify-email-switch">
          Entered the wrong email?{" "}
          <Link to="/register">
            Register Again
          </Link>
        </p>

        <Link
          className="verify-email-home-link"
          to="/"
        >
          ← Back to KnightMarket
        </Link>
      </section>
    </main>
  );
}

export default VerifyEmail;