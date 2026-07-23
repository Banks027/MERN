import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Sign in information:", formData);

    // Your teammate will connect the sign-in API here.
  }

  return (
    <main className="auth-page">
      <section className="auth-layout">
        <div className="auth-visual">
          <div className="auth-brand">
            Knight<span>Market</span>
          </div>

          <div className="auth-visual-content">
            <h2>
              Welcome Back, <span>Knight.</span>
            </h2>

            <p>
              Sign in to buy, sell, and connect with students across the UCF
              community.
            </p>
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
              Access your KnightMarket account.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">UCF Email</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@ucf.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="auth-button">
                Sign In
              </button>
            </form>

            <div className="auth-divider">or</div>

            <button type="button" className="google-button">
              Continue with Google
            </button>

            <p className="auth-switch">
              Do not have an account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Login;
