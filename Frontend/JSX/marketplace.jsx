import React from "react";
import "../CSS/marketplace.css";

function Marketplace() {
  const listings = [
    {
      id: 1,
      title: "MacBook Air M2",
      price: "$800",
      category: "Electronics",
      condition: "Like New",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Calculus Textbook",
      price: "$45",
      category: "Books",
      condition: "Good",
      location: "UCF Library",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Gaming Monitor",
      price: "$150",
      category: "Electronics",
      condition: "Excellent",
      location: "Knights Circle",
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Desk Chair",
      price: "$40",
      category: "Furniture",
      condition: "Used",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Mini Fridge",
      price: "$75",
      category: "Dorm",
      condition: "Good",
      location: "NorthView",
      image:
        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "TI-84 Calculator",
      price: "$60",
      category: "School",
      condition: "Like New",
      location: "Engineering Building",
      image:
        "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="marketplace-page">

      {/* ---------- Navbar ---------- */}

      <header className="navbar">

        <a className="brand" href="/">
          <span className="brand-knight">♞</span>
          <span>Knight</span>
          <strong>Market</strong>
        </a>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/marketplace">Browse Listings</a>
          <a href="/saved">Saved</a>
          <a href="/notifications">Notifications</a>
          <a href="/about">About</a>
        </nav>

        <div className="nav-actions">

          <button
            className="notification-button"
            aria-label="Notifications"
          >
            🔔
          </button>

          <button
            className="profile-button"
            aria-label="Profile"
          >
            👤
          </button>

          <button className="post-item-button">
            Post Item
          </button>

        </div>

      </header>

      {/* ---------- Hero ---------- */}

      <section className="marketplace-hero">

        <h1>Browse Listings</h1>

        <p>
          Discover textbooks, electronics, furniture,
          and more from fellow UCF students.
        </p>

        <div className="search-container">

          <input
            type="text"
            placeholder="Search for anything..."
          />

          <button>
            Search
          </button>

        </div>

      </section>

      {/* ---------- Content ---------- */}

      <main className="marketplace-content">

        {/* Sidebar */}

        <aside className="filter-sidebar">

          <h2>Filters</h2>

          <div className="filter-group">

            <label>Category</label>

            <select>

              <option>All Categories</option>

              <option>Electronics</option>

              <option>Books</option>

              <option>Furniture</option>

              <option>Dorm</option>

            </select>

          </div>

          <div className="filter-group">

            <label>Condition</label>

            <select>

              <option>Any</option>

              <option>New</option>

              <option>Like New</option>

              <option>Used</option>

            </select>

          </div>

          <div className="filter-group">

            <label>Maximum Price</label>

            <input
              type="number"
              placeholder="$500"
            />

          </div>

          <button className="gold-button">
            Apply Filters
          </button>

        </aside>

        {/* Products */}

        <section className="listing-grid">

          {listings.map((listing) => (

            <article
              className="listing-card"
              key={listing.id}
            >

              <div className="listing-image-wrapper">

                <img
                  src={listing.image}
                  alt={listing.title}
                />

                <button className="heart-button">

                  ♡

                </button>

              </div>

              <div className="listing-details">

                <span className="listing-category">

                  {listing.category}

                </span>

                <h3>

                  {listing.title}

                </h3>

                <strong>

                  {listing.price}

                </strong>

                <p>

                  {listing.condition}

                </p>

                <small>

                  📍 {listing.location}

                </small>

                <button className="view-button">

                  View Listing

                </button>

              </div>

            </article>

          ))}

        </section>

      </main>

      {/* Pagination */}

      <section className="pagination">

        <button>Previous</button>

        <button className="active-page">
          1
        </button>

        <button>2</button>

        <button>3</button>

        <button>Next</button>

      </section>

    </div>
  );
}

export default Marketplace;
