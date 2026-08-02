import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  sendStudentVerificationCode,
  verifyStudentEmailCode,
} from "../api/studentEmailApi";

import "../styles/StudentEmailVerification.css";

function StudentEmailVerification() {
  const { user, reloadUser } = useAuth();

  const [studentEmail, setStudentEmail] = useState(
    user?.studentEmail || ""
  );

  const [verificationCode, setVerificationCode] =
    useState("");

  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  if (user?.verifiedStudent) {
    return (
      <section
        className="student-verification student-verification--verified"
        aria-labelledby="student-verification-title"
      >
        <div>
          <p className="student-verification-label">
            Student status
          </p>

          <h2 id="student-verification-title">
            UCF student verified
          </h2>

          <p>
            Your student status has been successfully verified.
          </p>
        </div>

        <span
          className="student-verification-badge"
          aria-label="Verified"
        >
          ✓ Verified
        </span>
      </section>
    );
  }

  async function handleSendCode(event) {
    event.preventDefault();

    setErrorMessage("");
    setMessage("");

    const normalizedEmail = studentEmail
      .trim()
      .toLowerCase();

    if (!normalizedEmail.endsWith("@ucf.edu")) {
      setErrorMessage(
        "Please enter a valid UCF email address."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const data =
        await sendStudentVerificationCode(
          normalizedEmail
        );

      setStudentEmail(normalizedEmail);
      setCodeSent(true);
      setMessage(
        data.message ||
          "A verification code was sent to your UCF email."
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to send the verification code."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyCode(event) {
    event.preventDefault();

    setErrorMessage("");
    setMessage("");

    const normalizedCode = verificationCode.trim();

    if (!/^\d{6}$/.test(normalizedCode)) {
      setErrorMessage(
        "Enter the six-digit code from your email."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const data =
        await verifyStudentEmailCode(
          normalizedCode
        );

      setMessage(
        data.message ||
          "Your UCF email was verified."
      );

      await reloadUser();
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to verify the code."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="student-verification"
      aria-labelledby="student-verification-title"
    >
      <div className="student-verification-heading">
        <p className="student-verification-label">
          Action required
        </p>

        <h2 id="student-verification-title">
          Verify your UCF email
        </h2>

        <p>
          Verify access to a UCF email before listing
          or purchasing marketplace items.
        </p>
      </div>

      {!codeSent ? (
        <form
          className="student-verification-form"
          onSubmit={handleSendCode}
        >
          <label htmlFor="student-email">
            UCF email address
          </label>

          <div className="student-verification-row">
            <input
              id="student-email"
              type="email"
              value={studentEmail}
              placeholder="example@ucf.edu"
              autoComplete="email"
              onChange={(event) =>
                setStudentEmail(event.target.value)
              }
              disabled={isSubmitting}
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Sending..."
                : "Send Code"}
            </button>
          </div>
        </form>
      ) : (
        <form
          className="student-verification-form"
          onSubmit={handleVerifyCode}
        >
          <p>
            Code sent to{" "}
            <strong>{studentEmail}</strong>.
          </p>

          <label htmlFor="student-verification-code">
            Six-digit verification code
          </label>

          <div className="student-verification-row">
            <input
              id="student-verification-code"
              type="text"
              value={verificationCode}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              onChange={(event) =>
                setVerificationCode(
                  event.target.value.replace(/\D/g, "")
                )
              }
              disabled={isSubmitting}
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Verifying..."
                : "Verify Email"}
            </button>
          </div>

          <button
            type="button"
            className="student-verification-secondary"
            onClick={() => {
              setCodeSent(false);
              setVerificationCode("");
              setMessage("");
              setErrorMessage("");
            }}
            disabled={isSubmitting}
          >
            Use a different email
          </button>
        </form>
      )}

      {message && (
        <p
          className="student-verification-message"
          role="status"
        >
          {message}
        </p>
      )}

      {errorMessage && (
        <p
          className="student-verification-error"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </section>
  );
}

export default StudentEmailVerification;