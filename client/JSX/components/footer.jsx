import React from "react";

function Footer({ scrollToSection }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="brand-shield">♞</span>

            <strong>
              Knight<span>Marketplace</span>
            </strong>
          </div>

          <p>
            UCF's student-to-student marketplace. Buy, sell, and connect
            safely on campus.
          </p>
        </div>

        <div>
          <h3>Marketplace</h3>

          <button
            type="button"
            onClick={() => scrollToSection("listings")}
          >
            Browse Listings
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("categories")}
          >
            All Categories
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("listings")}
          >
            Featured Listings
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </button>
        </div>

        <div>
          <h3>Company</h3>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            Our Mission
          </button>

          <button type="button">
            Safety Tips
          </button>

          <button type="button">
            Contact Us
          </button>
        </div>

        <div>
          <h3>Support</h3>

          <button type="button">
            Help Center
          </button>

          <button type="button">
            Community Guidelines
          </button>

          <button type="button">
            Report an Issue
          </button>

          <button type="button">
            Privacy Policy
          </button>
        </div>

        <div className="footer-register">
          <h3>Students only. Knights only.</h3>

          <p>
            Join the safer and smarter campus marketplace.
          </p>

          <button
            className="primary-button"
            type="button"
          >
            Register Now
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 KnightMarketplace. All rights reserved.</p>

        <div>
          <button type="button">
            Terms of Use
          </button>

          <button type="button">
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
