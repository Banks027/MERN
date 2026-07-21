
import React from "react";

function Navbar({ scrollToSection }) {
  return (
    <header className="navbar">
      <button
        className="brand"
        onClick={() => scrollToSection("home")}
        type="button"
      >
        <span className="brand-shield">♞</span>

        <span>
          Knight<span>Marketplace</span>
        </span>
      </button>

      <nav className="nav-links">
        <button
          type="button"
          onClick={() => scrollToSection("home")}
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("listings")}
        >
          Browse
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("categories")}
        >
          Categories
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("about")}
        >
          About
        </button>

        <button
          type="button"
          onClick={() => scrollToSection("how-it-works")}
        >
          How It Works
        </button>
      </nav>

      <div className="nav-actions">
        <button
          className="login-button"
          type="button"
        >
          Login
        </button>

        <button
          className="register-button"
          type="button"
        >
          Register
        </button>
      </div>
    </header>
  );
}

export default Navbar;
