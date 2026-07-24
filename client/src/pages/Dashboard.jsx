import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/Dashboard.css";

function Dashboard() {
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const displayName =
    user?.firstName ||
    user?.displayName?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Knight";

  const avatarLetter =
    displayName.charAt(0).toUpperCase();

  async function handleSignOut() {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Unable to sign out:", error);
    }
  }

  const listings = [
    {
      id: 1,
      title: "MacBook Air M2",
      price: "$750",
      category: "Electronics",
      condition: "Like New",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 2,
      title: "Calculus Textbook",
      price: "$45",
      category: "Books",
      condition: "Good",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 3,
      title: "Modern Study Desk",
      price: "$90",
      category: "Furniture",
      condition: "Good",
      image:
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 4,
      title: "Nike Running Shoes",
      price: "$65",
      category: "Clothing",
      condition: "Like New",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* ==============================
          DASHBOARD NAVBAR
      ============================== */}

      <header className="dashboard-navbar">
        <div className="dashboard-navbar-inner">
          <Link to="/dashboard" className="dashboard-brand">
            <span className="dashboard-brand-icon">♞</span>

            <span>
              Knight<span>Marketplace</span>
            </span>
          </Link>

          <div className="dashboard-profile-wrapper">
            <button
              type="button"
              className="dashboard-profile-button"
              onClick={() => setProfileOpen(!profileOpen)}
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
                <Link to="/profile">My Profile</Link>

                <Link to="/my-listings">My Listings</Link>

                <Link to="/settings">Settings</Link>

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
              Manage your listings and discover great deals from fellow
              Knights.
            </p>

            <div className="dashboard-hero-actions">
              <Link
                to="/post-item"
                className="dashboard-primary-button"
              >
                <span>＋</span>
                Post an Item
              </Link>

              <Link
                to="/my-listings"
                className="dashboard-secondary-button"
              >
                My Listings
              </Link>
            </div>
          </div>
        </section>

        {/* ==============================
            DASHBOARD STATISTICS
        ============================== */}

        <section className="dashboard-overview">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-section-label">
                Your marketplace
              </p>

              <h2>Marketplace Overview</h2>
            </div>
          </div>

          <div className="dashboard-stats-grid">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">📦</div>

              <div>
                <strong>4</strong>
                <p>Active Listings</p>
                <small>Items currently available</small>
              </div>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">👁</div>

              <div>
                <strong>128</strong>
                <p>Listing Views</p>
                <small>Total listing activity</small>
              </div>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">✓</div>

              <div>
                <strong>7</strong>
                <p>Items Sold</p>
                <small>Completed marketplace sales</small>
              </div>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">🏷</div>

              <div>
                <strong>2</strong>
                <p>Active Offers</p>
                <small>Offers awaiting review</small>
              </div>
            </article>
          </div>
        </section>

        {/* ==============================
            BROWSE LISTINGS PREVIEW
        ============================== */}

        <section className="dashboard-listings-section">
          <div className="dashboard-section-header">
            <div>
              <p className="dashboard-section-label">
                Discover something new
              </p>

              <h2>Browse Listings</h2>
            </div>

            <Link
              to="/listings"
              className="dashboard-view-all-link"
            >
              View All Listings →
            </Link>
          </div>

          <div className="dashboard-listings-grid">
            {listings.map((listing) => (
              <article
                className="dashboard-listing-card"
                key={listing.id}
              >
                <div className="dashboard-listing-image">
                  <img
                    src={listing.image}
                    alt={listing.title}
                  />

                  <span className="dashboard-listing-price">
                    {listing.price}
                  </span>
                </div>

                <div className="dashboard-listing-content">
                  <span className="dashboard-listing-category">
                    {listing.category}
                  </span>

                  <h3>{listing.title}</h3>

                  <div className="dashboard-listing-details">
                    <span>{listing.condition}</span>
                    <span>UCF Campus</span>
                  </div>

                  <Link
                    to={`/listings/${listing.id}`}
                    className="dashboard-listing-button"
                  >
                    View Listing
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>
          © 2026 KnightMarketplace. Built for the UCF community.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;