import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/ErrorPage.css";

function ErrorPage() {
  return (
    <>
      <Navbar
        showNavLinks={false}
        showAuthButtons={false}
      />

      <main className="error-page">

        <div className="error-card">

          <div className="error-icon">
            ♞
          </div>

          <h1>404</h1>

          <h2>Oops! Listing Not Found</h2>

          <p>
            The page you're looking for doesn't exist,
            may have been moved, or the listing is no
            longer available.
          </p>

          <div className="error-buttons">

            <Link
              to="/"
              className="primary-button"
            >
              Return Home
            </Link>

            <Link
              to="/listings"
              className="secondary-button"
            >
              Browse Listings
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default ErrorPage;