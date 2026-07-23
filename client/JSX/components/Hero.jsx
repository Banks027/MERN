import React from "react";
import SearchBar from "./SearchBar";

function Hero({ search, setSearch, scrollToSection }) {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-label">THE UCF STUDENT MARKETPLACE</p>

        <h1>
          The student <span>marketplace</span>
          <br />
          built for Knights.
        </h1>

        <p className="hero-description">
          Buy, sell, and connect with fellow UCF students safely,
          easily, and all in one place.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-button"
            type="button"
          >
            Register
          </button>

          <button
            className="secondary-button"
            type="button"
          >
            Login
          </button>
        </div>

        <div className="hero-security">
          <span>🛡️</span>
          Students only. Safer campus connections.
        </div>

        <SearchBar
          search={search}
          setSearch={setSearch}
          scrollToSection={scrollToSection}
        />
      </div>
    </section>
  );
}

export default Hero;
