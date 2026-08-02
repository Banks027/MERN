import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Footer from "../components/Footer";

import "../styles/Dashboard.css";
import "../styles/Profile.css";

function isUcfEmail(email) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  return (
    normalizedEmail.endsWith("@ucf.edu") ||
    normalizedEmail.endsWith("@knights.ucf.edu")
  );
}

function formatPhoneNumber(phoneNumber) {
  const digits = String(phoneNumber || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(
      3,
      6
    )}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(
      4,
      7
    )}-${digits.slice(7)}`;
  }

  return phoneNumber || "Not provided";
}

function Profile() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [latestListingPhone, setLatestListingPhone] =
    useState("");
  const [editingProfile, setEditingProfile] =
    useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  useEffect(() => {
    setProfileUser(user || null);
  }, [user]);

  useEffect(() => {
    async function loadLatestListingPhone() {
      try {
        const response = await fetch(
          "/api/listings/mine",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const userListings = Array.isArray(data.listings)
          ? data.listings
          : [];

        const listingWithPhone = userListings.find(
          (listing) => listing.contactPhone
        );

        setLatestListingPhone(
          listingWithPhone?.contactPhone || ""
        );
      } catch (error) {
        console.error(
          "Unable to load the latest listing phone:",
          error
        );
      }
    }

    loadLatestListingPhone();
  }, []);

  const currentUser = profileUser || user || {};

  const fullName =
    currentUser.displayName ||
    currentUser.name ||
    [
      currentUser.firstName,
      currentUser.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    currentUser.email?.split("@")[0] ||
    "KnightMarketplace User";

  const displayName =
    currentUser.firstName ||
    fullName.split(" ")[0] ||
    "Knight";

  const avatarLetter =
    displayName.charAt(0).toUpperCase();

  const primaryEmail = currentUser.email || "";
  const studentEmail =
    currentUser.studentEmail || "";

  const primaryEmailIsUcf =
    isUcfEmail(primaryEmail);

  const displayedPhone =
    currentUser.phone ||
    latestListingPhone ||
    "";

  const memberSinceYear = currentUser.createdAt
    ? new Date(currentUser.createdAt).getFullYear()
    : new Date().getFullYear();

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

  function openEditProfile() {
    setProfileError("");

    setEditForm({
      displayName: fullName,
      phone:
        currentUser.phone ||
        latestListingPhone ||
        "",
    });

    setEditingProfile(true);
  }

  async function saveProfile() {
    setIsSaving(true);
    setProfileError("");

    try {
      const response = await fetch(
        "/auth/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            displayName: editForm.displayName,
            phone: editForm.phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update your profile."
        );
      }

      setProfileUser(data.user);
      setEditingProfile(false);
    } catch (error) {
      setProfileError(
        error.message ||
          "Unable to update your profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
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
                <Link to="/dashboard">Home</Link>

                <Link to="/my-listings">
                  My Listings
                </Link>

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
        <h1 className="profile-title">
          My Profile
        </h1>

        <section className="profile-container">
          <div className="profile-card">
            <div className="profile-picture">
              {avatarLetter}
            </div>

            <h2>{fullName}</h2>

            <p>
              Member Since {memberSinceYear}
            </p>

          </div>

          <div className="account-card">
            <div className="account-card-header">
              <h2>Account Information</h2>

              {!editingProfile && (
                <button
                  type="button"
                  className="edit-profile-btn"
                  onClick={openEditProfile}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {profileError && (
              <p className="profile-edit-error">
                {profileError}
              </p>
            )}

            <div className="account-info">
              <div>
                <span>Full Name</span>

                {editingProfile ? (
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        displayName: event.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{fullName}</p>
                )}
              </div>

              {primaryEmailIsUcf ? (
                <div>
                  <span>UCF Email</span>
                  <p>{primaryEmail}</p>
                </div>
              ) : (
                <>
                  <div>
                    <span>Email Address</span>
                    <p>{primaryEmail || "Not provided"}</p>
                  </div>

                  {studentEmail && (
                    <div>
                      <span>UCF Email</span>
                      <p>{studentEmail}</p>
                    </div>
                  )}
                </>
              )}

              <div>
                <span>Phone Number</span>

                {editingProfile ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        phone: event.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{formatPhoneNumber(displayedPhone)}</p>
                )}
              </div>
            </div>

            {editingProfile ? (
              <div className="profile-inline-actions">
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={() => setEditingProfile(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-save-button"
                  onClick={saveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="password-btn"
              >
                Change Password
              </button>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

export default Profile;