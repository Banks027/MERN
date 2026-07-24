import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SignInPopup from "../components/SignInPopup";
import "../styles/Listings.css";

const marketplaceListings = [
  {
    id: 1,
    title: 'MacBook Air M2 13"',
    price: 750,
    category: "Electronics",
    condition: "Like New",
    seller: "Jordan Knight",
    date: "Posted 2 hours ago",
    location: "UCF Main Campus",
    description:
      "MacBook Air M2 in excellent condition. Includes the original charger and protective case.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Ergonomic Desk Chair",
    price: 45,
    category: "Furniture",
    condition: "Good",
    seller: "Ashley M.",
    date: "Posted 3 hours ago",
    location: "UCF Main Campus",
    description:
      "Comfortable adjustable desk chair. Great for studying or working from home.",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Calculus Textbook",
    price: 80,
    category: "Textbooks",
    condition: "Good",
    seller: "Michael R.",
    date: "Posted 5 hours ago",
    location: "UCF Main Campus",
    description:
      "Calculus: Early Transcendentals textbook. Some highlighting, but all pages are intact.",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Nike Backpack",
    price: 30,
    category: "Clothing",
    condition: "Like New",
    seller: "Taylor S.",
    date: "Posted 6 hours ago",
    location: "UCF Main Campus",
    description:
      "Black Nike backpack with several compartments. Clean and lightly used.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Gaming Monitor",
    price: 150,
    category: "Electronics",
    condition: "Excellent",
    seller: "Chris P.",
    date: "Posted yesterday",
    location: "UCF Main Campus",
    description:
      "24-inch gaming monitor with a fast refresh rate. Includes HDMI cable and power cord.",
    image:
      "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Mini Refrigerator",
    price: 90,
    category: "Dorm Essentials",
    condition: "Good",
    seller: "Emily K.",
    date: "Posted yesterday",
    location: "UCF Main Campus",
    description:
      "Compact mini refrigerator that is perfect for a dorm room. Clean and working properly.",
    image:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    title: "Modern Desk Lamp",
    price: 20,
    category: "Furniture",
    condition: "Like New",
    seller: "David L.",
    date: "Posted 2 days ago",
    location: "UCF Main Campus",
    description:
      "Modern adjustable desk lamp with multiple brightness settings.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    title: "iPad Air",
    price: 425,
    category: "Electronics",
    condition: "Excellent",
    seller: "Sarah W.",
    date: "Posted 2 days ago",
    location: "UCF Main Campus",
    description:
      "iPad Air in excellent condition. Includes charger and protective case.",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
  },
];

const categories = [
  "All",
  "Electronics",
  "Furniture",
  "Textbooks",
  "Clothing",
  "Dorm Essentials",
];

function Listings() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [selectedListing, setSelectedListing] =
    useState(null);
  const [showSignInPopup, setShowSignInPopup] =
    useState(false);
  const [pendingAction, setPendingAction] =
    useState("");

  const isLoggedIn = Boolean(
    localStorage.getItem("token")
  );

  const filteredListings = marketplaceListings.filter(
    (listing) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        listing.title
          .toLowerCase()
          .includes(searchText) ||
        listing.category
          .toLowerCase()
          .includes(searchText) ||
        listing.seller
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        listing.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }
  );

  function openListing(listing) {
    setSelectedListing(listing);
  }

  function closeListing() {
    setSelectedListing(null);
    setShowSignInPopup(false);
    setPendingAction("");
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

  function performLoggedInAction(action, listing) {
    if (action === "save") {
      alert(`${listing.title} was saved.`);
    }

    if (action === "message") {
      alert(`Opening messages with ${listing.seller}.`);
    }

    if (action === "contact") {
      alert(
        `Opening contact options for ${listing.seller}.`
      );
    }
  }

  function handlePostListing() {
    if (!isLoggedIn) {
      setSelectedListing(null);
      setPendingAction("post");
      setShowSignInPopup(true);
      return;
    }

    navigate("/dashboard");
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
              Find textbooks, electronics, furniture,
              clothing, and dorm essentials from fellow
              UCF students.
            </p>

            <div className="all-listings-search-box">
              <span aria-hidden="true">⌕</span>

              <input
                type="text"
                placeholder="Search by item, category, or seller..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search-button"
                  onClick={() => setSearch("")}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="all-listings-content">
          <aside className="listings-filter-sidebar">
            <div className="filter-heading">
              <h2>Categories</h2>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                }}
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
                      marketplaceListings.filter(
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
                  ? "You can save items, contact sellers, and manage your account."
                  : "You can browse and view details. Sign in to save items or contact sellers."}
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

              <select
                aria-label="Sort listings"
                defaultValue="newest"
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>
              </select>
            </div>

            {filteredListings.length > 0 ? (
              <div className="all-listings-grid">
                {filteredListings.map(
                  (listing) => (
                    <article
                      className="all-listing-card"
                      key={listing.id}
                    >
                      <div className="all-listing-image-wrapper">
                        <img
                          src={listing.image}
                          alt={listing.title}
                        />

                        <span className="condition-badge">
                          {listing.condition}
                        </span>

                        <button
                          type="button"
                          className="listing-heart-button"
                          aria-label={`Save ${listing.title}`}
                          onClick={() =>
                            requireSignIn(
                              "save",
                              listing
                            )
                          }
                        >
                          ♡
                        </button>
                      </div>

                      <div className="all-listing-card-content">
                        <p className="card-category">
                          {listing.category}
                        </p>

                        <h3>{listing.title}</h3>

                        <p className="card-price">
                          ${listing.price}
                        </p>

                        <div className="listing-location">
                          <span>📍</span>
                          <p>{listing.location}</p>
                        </div>

                        <div className="listing-seller-row">
                          <div className="small-seller-avatar">
                            {listing.seller.charAt(0)}
                          </div>

                          <div>
                            <strong>
                              {listing.seller}
                            </strong>

                            <small>
                              {listing.date}
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
                  Try another search or category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
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
                src={selectedListing.image}
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

              <h3>${selectedListing.price}</h3>

              <div className="listing-details-meta">
                <span>
                  📍 {selectedListing.location}
                </span>

                <span>
                  {selectedListing.date}
                </span>
              </div>

              <div className="listing-description">
                <h4>Description</h4>

                <p>
                  {selectedListing.description}
                </p>
              </div>

              <div className="listing-seller-box">
                <div className="listing-seller-avatar">
                  {selectedListing.seller.charAt(0)}
                </div>

                <div>
                  <small>Seller</small>

                  <strong>
                    {selectedListing.seller}
                  </strong>

                  <p>Verified UCF Student</p>
                </div>
              </div>

              {!isLoggedIn && (
                <div className="login-required-message">
                  Sign in to save this item or contact
                  the seller.
                </div>
              )}

              <div className="listing-action-buttons">
                <button
                  type="button"
                  className="save-listing-button"
                  onClick={() =>
                    requireSignIn(
                      "save",
                      selectedListing
                    )
                  }
                >
                  ♡ Save Item
                </button>

                <button
                  type="button"
                  className="message-listing-button"
                  onClick={() =>
                    requireSignIn(
                      "message",
                      selectedListing
                    )
                  }
                >
                  💬 Message Seller
                </button>

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
