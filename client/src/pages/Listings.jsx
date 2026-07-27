import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SignInPopup from "../components/SignInPopup";
import { useAuth } from "../context/AuthContext";

import "../styles/Listings.css";

const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80";

const categories = [
  "All",
  "Electronics",
  "Furniture",
  "Textbooks",
  "Clothing",
  "Dorm Essentials",
];

function getSellerName(listing) {
  return (
    listing.seller?.displayName ||
    "KnightMarketplace Seller"
  );
}

function getListingImage(listing) {
  if (
    Array.isArray(listing.images) &&
    listing.images.length > 0
  ) {
    return listing.images[0];
  }

  return DEFAULT_LISTING_IMAGE;
}

function getPaymentMethods(listing) {
  if (
    Array.isArray(listing.paymentMethods) &&
    listing.paymentMethods.length > 0
  ) {
    return listing.paymentMethods.join(", ");
  }

  return "Not specified";
}

function getCampusStatus(listing) {
  const UCF_MAIN_CAMPUS_ZIP_CODES = [
    "32816",
  ];

  const zipCode = String(
    listing.zipCode || ""
  ).trim();

  if (
    UCF_MAIN_CAMPUS_ZIP_CODES.includes(zipCode)
  ) {
    return "On-campus student";
  }

  return "Off-campus student";
}

function formatListingDate(createdAt) {
  if (!createdAt) {
    return "Recently posted";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently posted";
  }

  return `Posted ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
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


function formatPhoneNumber(phoneNumber) {
  const digits = String(phoneNumber || "").replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  }

  return phoneNumber || "No phone number provided";
}

function Listings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] =
    useState(true);
  const [listingsError, setListingsError] =
    useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    async function loadListings() {
      setIsLoadingListings(true);
      setListingsError("");

      try {
        const response = await fetch("/api/listings", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load listings."
          );
        }

        setListings(
          Array.isArray(data.listings)
            ? data.listings
            : []
        );
      } catch (error) {
        setListingsError(
          error.message || "Unable to load listings."
        );
      } finally {
        setIsLoadingListings(false);
      }
    }

    loadListings();
  }, []);

  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [selectedListing, setSelectedListing] =
    useState(null);
  const [showSignInPopup, setShowSignInPopup] =
    useState(false);
  const [pendingAction, setPendingAction] =
    useState("");
  const [showContactInfo, setShowContactInfo] =
    useState(false);

  const isLoggedIn = Boolean(user);

  const filteredListings = listings.filter(
    (listing) =>
      selectedCategory === "All" ||
      listing.category === selectedCategory
  );

  function openListing(listing) {
    setSelectedListing(listing);
    setShowContactInfo(false);
  }

  function closeListing() {
    setSelectedListing(null);
    setShowSignInPopup(false);
    setPendingAction("");
    setShowContactInfo(false);
  }

  function requireSignIn(action, listing) {
    setSelectedListing(listing);
    setPendingAction(action);

    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }

    performLoggedInAction(action, listing);
  }

  function performLoggedInAction(action) {
    if (action === "contact") {
      setShowContactInfo(true);
    }
  }

  function handlePostListing() {
    if (!isLoggedIn) {
      setSelectedListing(null);
      setPendingAction("post");
      setShowSignInPopup(true);
      return;
    }

    navigate("/post-item");
  }

  return (
    <div className="all-listings-page">
      <header className="all-listings-navbar">
        <Link
          to="/"
          className="all-listings-logo"
        >
          Knight<span>Marketplace</span>
        </Link>

        <nav className="all-listings-nav-links">
          <Link to="/">Home</Link>

          {isLoggedIn ? (
            <Link to="/dashboard">
              Dashboard
            </Link>
          ) : (
            <Link to="/login">Sign In</Link>
          )}

          <button
            type="button"
            className="post-listing-nav-button"
            onClick={handlePostListing}
          >
            Post a Listing
          </button>
        </nav>
      </header>

      <main>
        <section className="all-listings-hero">
          <div className="all-listings-hero-content">
            <p className="all-listings-eyebrow">
              UCF STUDENT MARKETPLACE
            </p>

            <h1>Browse All Listings</h1>

            <p className="all-listings-intro">
              Browse textbooks, electronics, furniture,
              clothing, and more from verified UCF students.
            </p>
          </div>
        </section>

        <section className="all-listings-content">
          <aside className="listings-filter-sidebar">
            <div className="filter-heading">
              <h2>Categories</h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedCategory("All")
                }
              >
                Reset
              </button>
            </div>

            <div className="category-filter-buttons">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-filter active"
                      : "category-filter"
                  }
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  <span>{category}</span>

                  <span>
                    {
                      listings.filter(
                        (listing) =>
                          category === "All" ||
                          listing.category ===
                            category
                      ).length
                    }
                  </span>
                </button>
              ))}
            </div>

            <div className="public-access-box">
              <h3>
                {isLoggedIn
                  ? "Welcome back!"
                  : "Browsing as a guest"}
              </h3>

              <p>
                {isLoggedIn
                  ? "You can view listings, contact sellers, and manage your account."
                  : "You can browse and view details. Sign in to contact sellers."}
              </p>

              {!isLoggedIn && (
                <Link to="/login">
                  Sign In to Continue
                </Link>
              )}
            </div>
          </aside>

          <div className="listings-results-area">
            <div className="listings-results-header">
              <div>
                <p>
                  {filteredListings.length}{" "}
                  {filteredListings.length === 1
                    ? "listing"
                    : "listings"}{" "}
                  found
                </p>

                <h2>
                  {selectedCategory === "All"
                    ? "All Marketplace Items"
                    : selectedCategory}
                </h2>
              </div>

            </div>

            {isLoadingListings ? (
              <div className="no-listings-found">
                <h3>Loading listings...</h3>

                <p>
                  Retrieving the newest marketplace items.
                </p>
              </div>
            ) : listingsError ? (
              <div className="no-listings-found">
                <h3>Unable to load listings</h3>

                <p>{listingsError}</p>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="all-listings-grid">
                {filteredListings.map(
                  (listing) => (
                    <article
                      className="all-listing-card"
                      key={listing._id}
                    >
                      <div className="all-listing-image-wrapper">
                        <img
                          src={getListingImage(listing)}
                          alt={listing.title}
                        />

                        <span className="condition-badge">
                          {listing.condition}
                        </span>

                      </div>

                      <div className="all-listing-card-content">
                        <p className="card-category">
                          {listing.category}
                        </p>

                        <h3>{listing.title}</h3>

                        <p className="card-price">
                          {formatPrice(listing.price)}
                        </p>

                        <div className="listing-location">
                          <span>💳</span>
                          <p>{getPaymentMethods(listing)}</p>
                        </div>

                        <div className="listing-campus-status">
                          <span>🎓</span>
                          <p>{getCampusStatus(listing)}</p>
                        </div>

                        <div className="listing-seller-row">
                          <div className="small-seller-avatar">
                            {getSellerName(listing)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {getSellerName(listing)}
                            </strong>

                            <small>
                              {formatListingDate(
                                listing.createdAt
                              )}
                            </small>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="view-listing-button"
                          onClick={() =>
                            openListing(listing)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="no-listings-found">
                <span>⌕</span>

                <h3>No listings found</h3>

                <p>
                  Try another category.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory("All")
                  }
                >
                  View All Listings
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {selectedListing && (
        <div
          className="listing-details-backdrop"
          onClick={closeListing}
        >
          <div
            className="listing-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="listing-details-close"
              onClick={closeListing}
              aria-label="Close listing"
            >
              ×
            </button>

            <div className="listing-details-image">
              <img
                src={getListingImage(selectedListing)}
                alt={selectedListing.title}
              />

              <span>
                {selectedListing.condition}
              </span>
            </div>

            <div className="listing-details-content">
              <p className="listing-details-category">
                {selectedListing.category}
              </p>

              <h2>{selectedListing.title}</h2>

              <h3>
                {formatPrice(selectedListing.price)}
              </h3>

              <div className="listing-details-meta">
                <span>
                  💳 {getPaymentMethods(selectedListing)}
                </span>

                <span>
                  🎓 {getCampusStatus(selectedListing)}
                </span>

                <span>
                  {formatListingDate(
                    selectedListing.createdAt
                  )}
                </span>
              </div>

              <p className="campus-status-note">
                Campus status is estimated from the ZIP code
                provided by the seller.
              </p>

              <div className="listing-description">
                <h4>Description</h4>

                <p>
                  {selectedListing.description}
                </p>
              </div>

              <div className="listing-meeting-details">
                <h4>Meeting Details</h4>

                <div className="meeting-detail-group">
                  <strong>Preferred Meetup Locations</strong>

                  {Array.isArray(
                    selectedListing.meetupLocations
                  ) &&
                  selectedListing.meetupLocations.length > 0 ? (
                    <ul>
                      {selectedListing.meetupLocations.map(
                        (location, index) => (
                          <li key={`${location}-${index}`}>
                            {location}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No meetup locations were provided.</p>
                  )}
                </div>

                <div className="meeting-detail-group">
                  <strong>Meeting Description</strong>

                  <p>
                    {selectedListing.buyerInformation ||
                      "No additional meeting instructions were provided."}
                  </p>
                </div>
              </div>

              <div className="listing-seller-box">
                <div className="listing-seller-avatar">
                  {getSellerName(selectedListing)
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <small>Seller</small>

                  <strong>
                    {getSellerName(selectedListing)}
                  </strong>

                  <p>
                    {selectedListing.seller?.verifiedStudent
                      ? "Verified UCF Student"
                      : "Marketplace Seller"}
                  </p>
                </div>
              </div>

              {!isLoggedIn && (
                <div className="login-required-message">
                  Sign in to contact the seller.
                </div>
              )}

              <div className="listing-action-buttons">
                <button
                  type="button"
                  className="contact-listing-button"
                  onClick={() =>
                    requireSignIn(
                      "contact",
                      selectedListing
                    )
                  }
                >
                  Contact Seller
                </button>
              </div>

              <div className="listing-contact-area">
                <div
                  className={
                    showContactInfo
                      ? "listing-contact-panel visible"
                      : "listing-contact-panel hidden"
                  }
                >
                  <small>Seller contact number</small>

                  {selectedListing.contactPhone ? (
                    <a
                      href={`tel:${selectedListing.contactPhone}`}
                    >
                      {formatPhoneNumber(
                        selectedListing.contactPhone
                      )}
                    </a>
                  ) : (
                    <p>
                      The seller did not provide a contact
                      number.
                    </p>
                  )}

                  <p>
                    Mention the listing title when contacting
                    the seller.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SignInPopup
        showSignInPopup={showSignInPopup}
        setShowSignInPopup={
          setShowSignInPopup
        }
        selectedListing={selectedListing}
        pendingAction={pendingAction}
      />
    </div>
  );
}

export default Listings;