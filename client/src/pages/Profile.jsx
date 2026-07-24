import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Footer from "../components/Footer";

import "../styles/Dashboard.css";
import "../styles/Profile.css";

function Profile() {
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

  const avatarLetter = displayName.charAt(0).toUpperCase();

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

  return (
    <>
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

                <Link to="/dashboard">Home</Link>

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

      <main className="profile-page">
        <h1 className="profile-title">My Profile</h1>

        <section className="profile-container">

          <div className="profile-card">
            <div className="profile-picture">
              👤
            </div>

            <h2>Jessica Smith</h2>

            <p>Member Since 2026</p>

            <button className="edit-profile-btn">
              Edit Profile
            </button>
          </div>

          <div className="account-card">
            <h2>Account Information</h2>

            <div className="account-info">
              <div>
                <span>Full Name</span>
                <p>Jessica Smith</p>
              </div>

              <div>
                <span>Email Address</span>
                <p>jessica@email.com</p>
              </div>

              <div>
                <span>UCF Email</span>
                <p>jsmith@knights.ucf.edu</p>
              </div>

              <div>
                <span>Phone Number</span>
                <p>(555) 123-4567</p>
              </div>
            </div>

            <button className="password-btn">
              Change Password
            </button>
          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

export default Profile;