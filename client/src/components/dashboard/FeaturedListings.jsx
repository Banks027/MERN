import React from "react";
import "../../styles/Dashboard.css";

function FeaturedListings() {
  const listings = [
    {
      id: 1,
      title: 'MacBook Air M2 13"',
      price: "$850",
      condition: "Like new",
      location: "UCF Campus",
      time: "2h ago",
      image:
        "https://loremflickr.com/640/480/laptop,computer?lock=11",
    },
    {
      id: 2,
      title: "Ergonomic Desk Chair",
      price: "$45",
      condition: "Great condition",
      location: "UCF Campus",
      time: "3h ago",
      image:
        "https://loremflickr.com/640/480/office-chair?lock=12",
    },
    {
      id: 3,
      title: "Calculus Textbook",
      price: "$80",
      condition: "8th Edition",
      location: "UCF Campus",
      time: "5h ago",
      image:
        "https://loremflickr.com/640/480/textbook,math?lock=13",
    },
    {
      id: 4,
      title: "Nike Backpack",
      price: "$30",
      condition: "Lightly used",
      location: "UCF Campus",
      time: "6h ago",
      image:
        "https://loremflickr.com/640/480/backpack?lock=14",
    },
    {
      id: 5,
      title: "UCF Football Ticket",
      price: "$25",
      condition: "2 Tickets",
      location: "Addition Arena",
      time: "8h ago",
      image:
        "https://loremflickr.com/640/480/football,ticket?lock=15",
    },
  ];

  return (
    <section className="dashboard-panel featured-listings-section">
      <div className="dashboard-section-heading">
        <h2>Featured Listings</h2>

        <button type="button">
          View all listings →
        </button>
      </div>

      <div className="featured-listings-grid">
        {listings.map((listing) => (
          <article className="featured-listing-card" key={listing.id}>
            <div className="featured-listing-image">
              <img
                src={listing.image}
                alt={listing.title}
              />

              <span className="featured-price">
                {listing.price}
              </span>

              <button
                type="button"
                className="favorite-button"
                aria-label={`Save ${listing.title}`}
              >
                ♡
              </button>
            </div>

            <div className="featured-listing-content">
              <h3>{listing.title}</h3>
              <p>{listing.condition}</p>

              <div className="featured-listing-meta">
                <span>{listing.time}</span>
                <span>•</span>
                <span>{listing.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedListings;
