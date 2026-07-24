import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Footer from "../components/Footer";

import "../styles/Dashboard.css";
import "../styles/MyListings.css";

function MyListings() {
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
      console.error(error);
    }
  }

  const [searchTerm, setSearchTerm] = useState("");

  const [listingToDelete, setListingToDelete] = useState(null);

  const [editingListing, setEditingListing] = useState(null);

  const [listings, setListings] = useState([
    {
      id: 1,
      title: "MacBook Air M2",
      price: 750,
      category: "Electronics",
      condition: "Like New",
      status: "Active",
      views: 61,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 2,
      title: "Calculus Textbook",
      price: 45,
      category: "Books",
      condition: "Good",
      status: "Active",
      views: 34,
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 3,
      title: "Nike Running Shoes",
      price: 65,
      category: "Clothing",
      condition: "Like New",
      status: "Sold",
      views: 19,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 4,
      title: "Gaming Monitor",
      price: 185,
      category: "Electronics",
      condition: "Excellent",
      status: "Active",
      views: 52,
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
    },
  ]);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [listings, searchTerm]);

  const activeListings =
    listings.filter((listing) => listing.status === "Active").length;

  const soldListings =
    listings.filter((listing) => listing.status === "Sold").length;

  const totalViews =
    listings.reduce((total, listing) => total + listing.views, 0);

  function deleteListing(id) {
    setListings((current) =>
      current.filter((listing) => listing.id !== id)
    );

    setListingToDelete(null);
  }

  function saveListing() {
    setListings((current) =>
      current.map((listing) =>
        listing.id === editingListing.id
          ? editingListing
          : listing
      )
    );

    setEditingListing(null);
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
                <Link to="/dashboard">🏠 Home</Link>

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

      <main className="my-listings-page">

        <section className="my-listings-hero">

          <div>

            <p className="hero-label">
              Seller Dashboard
            </p>

            <h1>
              My Listings
            </h1>

            <p>
              Manage, edit and monitor everything you're selling on
              KnightMarketplace.
            </p>

          </div>

          <Link
            to="/post-item"
            className="post-item-button"
          >
            + Post New Item
          </Link>

        </section>

        <section className="listing-stats">

          <div className="listing-stat-card">
            <h2>{activeListings}</h2>
            <p>Active Listings</p>
          </div>

          <div className="listing-stat-card">
            <h2>{soldListings}</h2>
            <p>Items Sold</p>
          </div>

          <div className="listing-stat-card">
            <h2>{totalViews}</h2>
            <p>Total Views</p>
          </div>

        </section>

        <section className="listing-toolbar">

          <input
            type="text"
            placeholder="Search your listings..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </section>

        <section className="my-listings-grid">
                  {filteredListings.map((listing) => (
            <article
              className="my-listing-card"
              key={listing.id}
            >
              <div className="my-listing-image">
                <img
                  src={listing.image}
                  alt={listing.title}
                />

                <span className="listing-price">
                  ${listing.price}
                </span>
              </div>

              <div className="my-listing-content">

                <span className="listing-category">
                  {listing.category}
                </span>

                <h3>{listing.title}</h3>

                <div className="listing-details">
                  <span>{listing.condition}</span>

                  <span>{listing.views} Views</span>
                </div>

                <div className="listing-status">
                  <span
                    className={
                      listing.status === "Sold"
                        ? "status sold"
                        : "status active"
                    }
                  >
                    {listing.status}
                  </span>
                </div>

                <div className="listing-actions">

                  <Link
                    to={`/listings/${listing.id}`}
                    className="view-button"
                  >
                    👁 View
                  </Link>

                  <button
                    className="edit-button"
                    onClick={() =>
                      setEditingListing({
                        ...listing,
                      })
                    }
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      setListingToDelete(listing)
                    }
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>
            </article>
          ))}
        </section>

        {/* ============================
            EDIT LISTING MODAL
        ============================ */}

        {editingListing && (
          <div className="modal-overlay">

            <div className="listing-modal">

              <h2>Edit Listing</h2>

              <label>
                Title

                <input
                  type="text"
                  value={editingListing.title}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      title: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Price

                <input
                  type="number"
                  value={editingListing.price}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      price: Number(e.target.value)
                    })
                  }
                />
              </label>

              <label>
                Category

                <input
                  type="text"
                  value={editingListing.category}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      category: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Condition

                <input
                  type="text"
                  value={editingListing.condition}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      condition: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Status

                <select
                  value={editingListing.status}
                  onChange={(e) =>
                    setEditingListing({
                      ...editingListing,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Active</option>
                  <option>Sold</option>
                </select>
              </label>

              <div className="modal-buttons">

                <button
                  className="cancel-button"
                  onClick={() =>
                    setEditingListing(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="save-button"
                  onClick={saveListing}
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>
        )}

        {/* ============================
            DELETE MODAL
        ============================ */}

        {listingToDelete && (
          <div className="modal-overlay">

            <div className="listing-modal delete-modal">

              <h2>Delete Listing?</h2>

              <p>
                Are you sure you want to delete
              </p>

              <strong>
                {listingToDelete.title}
              </strong>

              <div className="modal-buttons">

                <button
                  className="cancel-button"
                  onClick={() =>
                    setListingToDelete(null)
                  }
                >
                  Cancel
                </button>

                <button
                  className="delete-confirm-button"
                  onClick={() =>
                    deleteListing(listingToDelete.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />

    </>
  );
}

export default MyListings;