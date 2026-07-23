import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ scrollToSection }) {
  const navigate = useNavigate();

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
           className="login-button nav-button"
           type="button"
          onClick={() => navigate("/login")}
           >
           Sign In
            </button> 

            <button
            className="register-button nav-button"
            type="button"
           onClick={() => navigate("/register")}
                  > 
        Register
       </button>
      </div>
    </header>
  );
}

export default Navbar;
