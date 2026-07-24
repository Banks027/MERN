import React from "react";

function ListingCard({
  listing,
  openListing,
}) {
  return (
    <article
      className="listing-card"
      onClick={() => openListing(listing)}
    >
      <div className="listing-image-container">
        <img
          src={listing.image}
          alt={listing.title}
        />

        <span className="price-badge">
          ${listing.price}
        </span>
      </div>

      <div className="listing-info">
        <h3>{listing.title}</h3>

        <p>{listing.condition}</p>

        <small>
          📍 {listing.location}
        </small>

        <small>{listing.date}</small>
      </div>
    </article>
  );
}

export default ListingCard;
