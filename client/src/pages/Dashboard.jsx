import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import StudentEmailVerification from
  "../components/StudentEmailVerification";

import "../styles/Dashboard.css";

const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80";

function getListingImage(listing) {
  if (
    Array.isArray(listing.images) &&
    listing.images.length > 0
  ) {
    return listing.images[0];
  }

  return DEFAULT_LISTING_IMAGE;
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "$0.00";
  }

  return numericPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function getCampusStatus(listing) {
  const zipCode = String(
    listing.zipCode || ""
  ).trim();

  return zipCode === "32816"
    ? "On-campus student"
    : "Off-campus student";
}

function Dashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] =
    useState(true);
  const [listingsError, setListingsError] =
    useState("");

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const isStudentVerified =
    Boolean(user?.verifiedStudent);

  const displayName =
    user?.firstName ||
    user?.displayName?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Knight";

  const avatarLetter =
    displayName.charAt(0).toUpperCase();

  useEffect(() => {
    async function loadListings() {
      setIsLoadingListings(true);
      setListingsError("");

      try {
        const response = await fetch(
          "/api/listings?limit=4",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load listings."
          );
        }

        setListings(
          Array.isArray(data.listings)
            ? data.listings
            : []
        );
      } catch (error) {
        setListingsError(
          error.message ||
            "Unable to load listings."
        );
      } finally {
        setIsLoadingListings(false);
      }
    }

    loadListings();
  }, []);

  async function handleSignOut() {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Unable to sign out:", error);
    }
  }

  return (
    <div className="dashboard-page">
      {/* ==============================
          DASHBOARD NAVBAR
      ============================== */}

      <header className="dashboard-navbar">
        <div className="dashboard-navbar-inner">
          <Link
            to="/dashboard"
            className="dashboard-brand"
          >
            <span className="dashboard-brand-icon">
              ♞
            </span>

            <span>
              Knight<span>Marketplace</span>
            </span>
          </Link>

          <div className="dashboard-profile-wrapper">
            <button
              type="button"
              className="dashboard-profile-button"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <span className="dashboard-profile-avatar">
                {avatarLetter}
              </span>

              <span className="dashboard-profile-name">
                {displayName}
              </span>

              <span className="dashboard-profile-arrow">
                {profileOpen ? "▲" : "▼"}
              </span>
            </button>

            {profileOpen && (
              <div className="dashboard-profile-menu">
                <Link to="/profile">
                  My Profile
                </Link>

                {isStudentVerified ? (
                  <Link to="/my-listings">
                    My Listings
                  </Link>
                ) : (
                  <span className="dashboard-disabled-menu-item">
                    🔒 My Listings
                  </span>
                )}

                <button
                  type="button"
                  className="dashboard-signout-link"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-container">
        <StudentEmailVerification />

        {/* ==============================
            HERO BANNER
        ============================== */}

        <section className="dashboard-hero">
          <div className="dashboard-hero-overlay"></div>

          <div className="dashboard-hero-content">
            <p className="dashboard-hero-label">
              KnightMarketplace Dashboard
            </p>

            <h1>
              Welcome,
              <span>{displayName}</span>
            </h1>

            <p className="dashboard-hero-description">
              Manage your listings and discover great deals
              from fellow Knights.
            </p>

            <div className="dashboard-hero-actions">
              {isStudentVerified ? (
                <Link
                  to="/post-item"
                  className="dashboard-primary-button"
                >
                  <span>＋</span>
                  Post an Item
                </Link>
              ) : (
                <button
                  type="button"
                  className="dashboard-primary-button dashboard-disabled-button"
                  disabled
                >
                  🔒 Post an Item
                </button>
              )}

              {isStudentVerified ? (
                <Link
                  to="/my-listings"
                  className="dashboard-secondary-button"
                >
                  My Listings
                </Link>
              ) : (
                <button
                  type="button"
                  className="dashboard-secondary-button dashboard-disabled-button"
                  disabled
                >
                  🔒 My Listings
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ==============================
            REAL MARKETPLACE LISTINGS
        ============================== */}

        <section className="dashboard-listings-section">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-section-label">
                Discover something new
              </p>

              <h2>Browse Listings</h2>
            </div>

            {isStudentVerified ? (
              <Link
                to="/listings"
                className="dashboard-view-all-link"
              >
                View All Listings →
              </Link>
            ) : (
              <span className="dashboard-view-all-link dashboard-disabled-link">
                🔒 Verification Required
              </span>
            )}
          </div>

          {isLoadingListings ? (
            <div className="dashboard-listings-message">
              Loading listings...
            </div>
          ) : listingsError ? (
            <div className="dashboard-listings-message">
              {listingsError}
            </div>
          ) : listings.length > 0 ? (
            <div className="dashboard-listings-grid">
              {listings.map((listing) => (
                <article
                  className="dashboard-listing-card"
                  key={listing._id}
                >
                  <div className="dashboard-listing-image">
                    <img
                      src={getListingImage(listing)}
                      alt={listing.title}
                    />

                    <span className="dashboard-listing-price">
                      {formatPrice(listing.price)}
                    </span>
                  </div>

                  <div className="dashboard-listing-content">
                    <span className="dashboard-listing-category">
                      {listing.category}
                    </span>

                    <h3>{listing.title}</h3>

                    <div className="dashboard-listing-details">
                      <span>{listing.condition}</span>
                      <span>
                        {getCampusStatus(listing)}
                      </span>
                    </div>

                    {isStudentVerified ? (
                      <Link
                        to="/listings"
                        className="dashboard-listing-button"
                      >
                        View Listing
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="dashboard-listing-button dashboard-disabled-button"
                        disabled
                      >
                        🔒 Verify Student Status
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-listings-message">
              No active listings are available yet.
            </div>
          )}
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>
          © 2026 KnightMarketplace. Built for the UCF
          community.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;