import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  function handleLogin() {
    navigate("/login");
  }

  function handleRegister() {
    navigate("/register");
  }

  return (
    <section className="hero" id="home">
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-label">
          THE UCF STUDENT MARKETPLACE
        </p>

        <h1>
          The student <span>marketplace</span>
          <br />
          built for Knights.
        </h1>

        <p className="hero-description">
          Buy, sell, and connect with fellow UCF
          students safely, easily, and all in one
          place.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-button"
            type="button"
            onClick={handleRegister}
          >
            Register
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>

        <div className="hero-security">
          <span>🛡️</span>
          Students only. Safer campus connections.
        </div>
      </div>
    </section>
  );
}

export default Hero;
