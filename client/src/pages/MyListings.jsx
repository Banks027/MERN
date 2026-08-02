import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Footer from "../components/Footer";

import "../styles/Dashboard.css";
import "../styles/MyListings.css";

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

function MyListings() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [listingToDelete, setListingToDelete] =
    useState(null);
  const [editingListing, setEditingListing] =
    useState(null);
  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] =
    useState(true);
  const [listingsError, setListingsError] =
    useState("");
  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] =
    useState(false);

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

  useEffect(() => {
    async function loadMyListings() {
      setIsLoadingListings(true);
      setListingsError("");

      try {
        const response = await fetch(
          "/api/listings/mine",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load your listings."
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
            "Unable to load your listings."
        );
      } finally {
        setIsLoadingListings(false);
      }
    }

    loadMyListings();
  }, []);

  async function handleSignOut() {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const filteredListings = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return listings;
    }

    return listings.filter((listing) =>
      String(listing.title || "")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [listings, searchTerm]);

  const activeListings = listings.length;

  async function deleteListing() {
    if (!listingToDelete?._id) {
      return;
    }

    setIsDeleting(true);
    setActionError("");

    try {
      const response = await fetch(
        `/api/listings/${listingToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete the listing."
        );
      }

      setListings((current) =>
        current.filter(
          (listing) =>
            listing._id !== listingToDelete._id
        )
      );

      setListingToDelete(null);
    } catch (error) {
      setActionError(
        error.message ||
          "Unable to delete the listing."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function saveListing() {
    if (!editingListing?._id) {
      return;
    }

    setIsSaving(true);
    setActionError("");

    try {
      const response = await fetch(
        `/api/listings/${editingListing._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editingListing.title,
            price: editingListing.price,
            category: editingListing.category,
            condition: editingListing.condition,
            description:
              editingListing.description || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update the listing."
        );
      }

      setListings((current) =>
        current.map((listing) =>
          listing._id === data.listing._id
            ? data.listing
            : listing
        )
      );

      setEditingListing(null);
    } catch (error) {
      setActionError(
        error.message ||
          "Unable to update the listing."
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

      <main className="my-listings-page">
        <section className="my-listings-hero">
          <div>
            <p className="hero-label">
              Seller Dashboard
            </p>

            <h1>My Listings</h1>

            <p>
              Manage and edit everything you're selling
              on KnightMarketplace.
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
        </section>

        <section className="listing-toolbar">
          <input
            type="text"
            placeholder="Search your listings..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </section>

        {listingsError && (
          <div className="my-listings-message">
            {listingsError}
          </div>
        )}

        {isLoadingListings ? (
          <div className="my-listings-message">
            Loading your listings...
          </div>
        ) : filteredListings.length > 0 ? (
          <section className="my-listings-grid">
            {filteredListings.map((listing) => (
              <article
                className="my-listing-card"
                key={listing._id}
              >
                <div className="my-listing-image">
                  <img
                    src={getListingImage(listing)}
                    alt={listing.title}
                  />

                  <span className="listing-price">
                    {formatPrice(listing.price)}
                  </span>
                </div>

                <div className="my-listing-content">
                  <span className="listing-category">
                    {listing.category}
                  </span>

                  <h3>{listing.title}</h3>

                  <div className="listing-details">
                    <span>{listing.condition}</span>
                    <span>Active</span>
                  </div>

                  <div className="listing-status">
                    <span className="status active">
                      Active
                    </span>
                  </div>

                  <div className="listing-actions">
                    <Link
                      to="/listings"
                      className="view-button"
                    >
                      👁 View
                    </Link>

                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => {
                        setActionError("");
                        setEditingListing({
                          ...listing,
                        });
                      }}
                    >
                      ✏ Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => {
                        setActionError("");
                        setListingToDelete(listing);
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="my-listings-message">
            You do not have any active listings.
          </div>
        )}

        {editingListing && (
          <div
            className="modal-overlay"
            onClick={() => setEditingListing(null)}
          >
            <div
              className="listing-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <h2>Edit Listing</h2>

              {actionError && (
                <p className="listing-action-error">
                  {actionError}
                </p>
              )}

              <div className="edit-listing-grid">
                <label className="edit-field edit-field-full">
                  Title

                  <input
                    type="text"
                    value={editingListing.title}
                    onChange={(event) =>
                      setEditingListing({
                        ...editingListing,
                        title: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="edit-field">
                  Price

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingListing.price}
                    onChange={(event) =>
                      setEditingListing({
                        ...editingListing,
                        price: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="edit-field">
                  Category

                  <select
                    value={editingListing.category}
                    onChange={(event) =>
                      setEditingListing({
                        ...editingListing,
                        category: event.target.value,
                      })
                    }
                  >
                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Furniture">
                      Furniture
                    </option>

                    <option value="Textbooks">
                      Textbooks
                    </option>

                    <option value="Clothing">
                      Clothing
                    </option>

                    <option value="Dorm Essentials">
                      Dorm Essentials
                    </option>
                  </select>
                </label>

                <label className="edit-field">
                  Condition

                  <select
                    value={editingListing.condition}
                    onChange={(event) =>
                      setEditingListing({
                        ...editingListing,
                        condition: event.target.value,
                      })
                    }
                  >
                    <option value="New">
                      New
                    </option>

                    <option value="Like New">
                      Like New
                    </option>

                    <option value="Good">
                      Good
                    </option>

                    <option value="Fair">
                      Fair
                    </option>
                  </select>
                </label>

                <label className="edit-field edit-field-full">
                  Description

                  <textarea
                    rows="5"
                    value={
                      editingListing.description || ""
                    }
                    onChange={(event) =>
                      setEditingListing({
                        ...editingListing,
                        description: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setEditingListing(null)
                  }
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="save-button"
                  onClick={saveListing}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {listingToDelete && (
          <div
            className="modal-overlay"
            onClick={() =>
              setListingToDelete(null)
            }
          >
            <div
              className="listing-modal delete-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <h2>Delete Listing?</h2>

              {actionError && (
                <p className="listing-action-error">
                  {actionError}
                </p>
              )}

              <p>
                Are you sure you want to permanently
                delete
              </p>

              <strong>
                {listingToDelete.title}
              </strong>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setListingToDelete(null)
                  }
                  disabled={isDeleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="delete-confirm-button"
                  onClick={deleteListing}
                  disabled={isDeleting}
                >
                  {isDeleting
                    ? "Deleting..."
                    : "Delete"}
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