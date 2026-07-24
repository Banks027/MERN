import React, { useState } from "react";

const categories = [
  { name: "Textbooks", icon: "📚" },
  { name: "Furniture", icon: "🪑" },
  { name: "Electronics", icon: "💻" },
  { name: "Housing", icon: "🏠" },
  { name: "Clothing", icon: "👕" },
  { name: "Tickets", icon: "🎟️" },
];

const listings = [
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
];

function Home() {
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  const filteredListings = listings.filter((listing) => {
    const searchText = search.toLowerCase();

    return (
      listing.title.toLowerCase().includes(searchText) ||
      listing.category.toLowerCase().includes(searchText)
    );
  });

  const openListing = (listing) => {
    setSelectedListing(listing);
  };

  const closeListing = () => {
    setSelectedListing(null);
    setShowSignInPopup(false);
  };

  const requireSignIn = () => {
    setShowSignInPopup(true);
  };

  const scrollToSection = (sectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="website">
      {/* Navigation */}
      <header className="navbar">
        <button
          className="brand"
          onClick={() => scrollToSection("home")}
          type="button"
        >
          <span className="brand-shield">♞</span>

          <span>
            Knight<span>Marketplace</span>
          </span>
        </button>

        <nav className="nav-links">
          <button onClick={() => scrollToSection("home")} type="button">
            Home
          </button>

          <button onClick={() => scrollToSection("listings")} type="button">
            Browse
          </button>

          <button onClick={() => scrollToSection("categories")} type="button">
            Categories
          </button>

          <button onClick={() => scrollToSection("about")} type="button">
            About
          </button>

          <button onClick={() => scrollToSection("how-it-works")} type="button">
            How It Works
          </button>
        </nav>

        <div className="nav-actions">
          <button className="login-button" type="button">
            Login
          </button>

          <button className="register-button" type="button">
            Register
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero" id="home">
          <div className="hero-overlay" />

          <div className="hero-content">
            <p className="hero-label">THE UCF STUDENT MARKETPLACE</p>

            <h1>
              The student <span>marketplace</span>
              <br />
              built for Knights.
            </h1>

            <p className="hero-description">
              Buy, sell, and connect with fellow UCF students safely, easily,
              and all in one place.
            </p>

            <div className="hero-buttons">
              <button className="primary-button" type="button">
                Register
              </button>

              <button className="secondary-button" type="button">
                Login
              </button>
            </div>

            <div className="hero-security">
              <span>🛡️</span>
              Students only. Safer campus connections.
            </div>

            <div className="hero-search">
              <input
                type="text"
                placeholder='Search for items, such as "Textbook"'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <button
                type="button"
                onClick={() => scrollToSection("listings")}
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Why the app exists */}
        <section className="purpose-section">
          <div className="section-heading">
            <p>OUR PURPOSE</p>

            <h2>
              Why <span>KnightMarketplace</span> Exists
            </h2>

            <p>
              We created KnightMarketplace to make campus commerce simple,
              safer, affordable, and student-focused.
            </p>
          </div>

          <div className="purpose-grid">
            <article className="purpose-card">
              <div className="purpose-icon">🎓</div>
              <h3>Student-Only Access</h3>
              <p>
                A marketplace designed for UCF students and the campus
                community.
              </p>
            </article>

            <article className="purpose-card">
              <div className="purpose-icon">🛡️</div>
              <h3>Safer Connections</h3>
              <p>
                Connect with verified students and arrange exchanges in public
                campus locations.
              </p>
            </article>

            <article className="purpose-card">
              <div className="purpose-icon">🏷️</div>
              <h3>Affordable for Knights</h3>
              <p>
                Find affordable textbooks, furniture, electronics, clothing,
                and more.
              </p>
            </article>

            <article className="purpose-card">
              <div className="purpose-icon">⚡</div>
              <h3>Simple and Convenient</h3>
              <p>
                Browse, post, save, and message without leaving the student
                marketplace.
              </p>
            </article>
          </div>
        </section>

        {/* Categories */}
        <section className="categories-section" id="categories">
          <div className="section-heading left-heading">
            <p>EXPLORE</p>
            <h2>Popular Categories</h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button
                className="category-card"
                key={category.name}
                type="button"
                onClick={() => {
                  setSearch(category.name);
                  scrollToSection("listings");
                }}
              >
                <span>{category.icon}</span>
                <strong>{category.name}</strong>
                <small>View listings</small>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Listings */}
        <section className="listing-section" id="listings">
          <div className="listing-heading">
            <div className="section-heading left-heading">
              <p>MARKETPLACE</p>
              <h2>Featured Listings</h2>
            </div>

            <button className="view-all-button" type="button">
              View All Listings →
            </button>
          </div>

          {filteredListings.length > 0 ? (
            <div className="listing-grid">
              {filteredListings.map((listing) => (
                <article
                  className="listing-card"
                  key={listing.id}
                  onClick={() => openListing(listing)}
                >
                  <div className="listing-image-container">
                    <img src={listing.image} alt={listing.title} />

                    <button
                      className="heart-button"
                      type="button"
                      aria-label="Save item"
                      onClick={(event) => {
                        event.stopPropagation();
                        requireSignIn();
                      }}
                    >
                      ♡
                    </button>

                    <span className="price-badge">${listing.price}</span>
                  </div>

                  <div className="listing-info">
                    <h3>{listing.title}</h3>
                    <p>{listing.condition}</p>
                    <small>📍 {listing.location}</small>
                    <small>{listing.date}</small>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No listings found</h3>
              <p>Try searching for another item or category.</p>

              <button type="button" onClick={() => setSearch("")}>
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <p>SIMPLE AND STUDENT-FOCUSED</p>
            <h2>How It Works</h2>
            <p>Start buying and selling in three simple steps.</p>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span>1</span>
              <div className="step-icon">👤</div>
              <h3>Create Your Account</h3>
              <p>Register using your UCF email and verify your account.</p>
            </article>

            <article className="step-card">
              <span>2</span>
              <div className="step-icon">🔍</div>
              <h3>Browse or Post</h3>
              <p>Find what you need or create your own marketplace listing.</p>
            </article>

            <article className="step-card">
              <span>3</span>
              <div className="step-icon">💬</div>
              <h3>Connect and Exchange</h3>
              <p>
                Message other Knights and arrange a safe campus exchange.
              </p>
            </article>
          </div>
        </section>

        {/* About */}
        <section className="about-section" id="about">
          <div className="about-image">
            <div className="about-image-overlay">
              <span>Built by Knights</span>
            </div>
          </div>

          <div className="about-content">
            <p className="section-label">ABOUT US</p>

            <h2>
              A better marketplace for the <span>UCF community.</span>
            </h2>

            <p>
              KnightMarketplace gives UCF students one convenient place to buy
              and sell items from other students. It reduces waste, helps
              students save money, and creates stronger campus connections.
            </p>

            <ul>
              <li>Designed for students</li>
              <li>Focused on safety and trust</li>
              <li>Easy buying and selling</li>
              <li>Convenient campus exchanges</li>
            </ul>

            <button className="primary-button" type="button">
              Learn More About Us
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
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
              UCF’s student-to-student marketplace. Buy, sell, and connect
              safely on campus.
            </p>

            <div className="social-links">
              <button type="button">◎</button>
              <button type="button">f</button>
              <button type="button">𝕏</button>
              <button type="button">✉</button>
            </div>
          </div>

          <div>
            <h3>Marketplace</h3>
            <button type="button">Browse Listings</button>
            <button type="button">All Categories</button>
            <button type="button">Featured Listings</button>
            <button type="button">How It Works</button>
          </div>

          <div>
            <h3>Company</h3>
            <button type="button">About Us</button>
            <button type="button">Our Mission</button>
            <button type="button">Safety Tips</button>
            <button type="button">Contact Us</button>
          </div>

          <div>
            <h3>Support</h3>
            <button type="button">Help Center</button>
            <button type="button">Community Guidelines</button>
            <button type="button">Report an Issue</button>
            <button type="button">Privacy Policy</button>
          </div>

          <div className="footer-register">
            <h3>Students only. Knights only.</h3>
            <p>Join the safer and smarter campus marketplace.</p>
            <button className="primary-button" type="button">
              Register Now
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 KnightMarketplace. All rights reserved.</p>
          <div>
            <button type="button">Terms of Use</button>
            <button type="button">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* Listing Details Modal */}
      {selectedListing && (
        <div className="modal-backdrop" onClick={closeListing}>
          <div
            className="listing-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              onClick={closeListing}
            >
              ×
            </button>

            <div className="listing-modal-image">
              <img
                src={selectedListing.image}
                alt={selectedListing.title}
              />

              <button
                className="modal-save-button"
                type="button"
                onClick={requireSignIn}
              >
                ♡ Save Item
              </button>
            </div>

            <div className="listing-modal-content">
              <p className="listing-category">
                {selectedListing.category}
              </p>

              <h2>{selectedListing.title}</h2>
              <h3>${selectedListing.price}</h3>

              <div className="listing-tags">
                <span>{selectedListing.condition}</span>
                <span>📍 {selectedListing.location}</span>
                <span>{selectedListing.date}</span>
              </div>

              <div className="modal-description">
                <h4>Description</h4>
                <p>{selectedListing.description}</p>
              </div>

              <div className="seller-box">
                <div className="seller-avatar">
                  {selectedListing.seller.charAt(0)}
                </div>

                <div>
                  <small>Seller</small>
                  <strong>{selectedListing.seller}</strong>
                  <p>UCF Student</p>
                </div>
              </div>

              <button
                className="message-seller-button"
                type="button"
                onClick={requireSignIn}
              >
                💬 Message Seller
              </button>

              <button
                className="contact-seller-button"
                type="button"
                onClick={requireSignIn}
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign-In Required Popup */}
      {showSignInPopup && (
        <div
          className="signin-popup-backdrop"
          onClick={() => setShowSignInPopup(false)}
        >
          <div
            className="signin-popup"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="popup-close"
              type="button"
              onClick={() => setShowSignInPopup(false)}
            >
              ×
            </button>

            <div className="popup-lock">🔒</div>

            <h2>Sign in to continue</h2>

            <p>
              You must sign in or create a Knight Marketplace account to
              contact this seller or save this item.
            </p>

            <button className="popup-signin-button" type="button">
              Sign In
            </button>

            <button className="popup-register-button" type="button">
              Register
            </button>

            <button
              className="popup-cancel-button"
              type="button"
              onClick={() => setShowSignInPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
