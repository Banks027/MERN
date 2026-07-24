import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../styles/Register.css";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email
      .trim()
      .toLowerCase();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      formData.password !== formData.confirmPassword
    ) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await registerUser({
        firstName,
        lastName,
        email,
        password: formData.password,
      });

      sessionStorage.setItem(
        "pendingRegistrationEmail",
        email
      );

      navigate("/verify-email", {
        state: {
          email,
          firstName,
          from:
            location.state?.from || "/dashboard",
          listingId: location.state?.listingId,
          action: location.state?.action,
        },
      });
    } catch (error) {
      if (
        error.code === "EMAIL_ALREADY_EXISTS" ||
        error.status === 409
      ) {
        setErrorMessage(
          "An account with this email already exists."
        );
        return;
      }

      setErrorMessage(
        error.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-header">
          <div
            className="register-icon"
            aria-hidden="true"
          >
            ♞
          </div>

          <h1>Register</h1>

          <p>
            Create your KnightMarket account and join
            the student community.
          </p>
        </div>

        {errorMessage && (
          <p
            className="register-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="register-name-row">
            <div className="register-form-group">
              <label htmlFor="firstName">
                First Name
              </label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                disabled={isSubmitting}
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={isSubmitting}
            />

            <small>
              A verification code will be sent to this
              email address.
            </small>
          </div>

          <div className="register-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={isSubmitting}
            />

            <small>
              Password must contain at least 8
              characters.
            </small>
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Enter your password again"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>

        <div className="register-divider">
          <span>or</span>
        </div>

        <div className="register-google-button-wrapper">
          <GoogleAuthButton
            width="400"
            destination={
              location.state?.from || "/dashboard"
            }
            navigate={navigate}
            location={location}
            onErrorMessage={setErrorMessage}
          />
        </div>

        <p className="register-switch">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>

        <Link
          className="register-home-link"
          to="/"
        >
          ← Back to KnightMarket
        </Link>
      </section>
    </main>
  );
}

export default Register;
