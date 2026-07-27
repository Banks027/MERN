import React from "react";

const DEFAULT_LISTING_IMAGE = "/placeholder-image.png";

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

function formatDate(createdAt) {
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

function getListingImage(listing) {
  if (
    Array.isArray(listing.images) &&
    listing.images.length > 0 &&
    listing.images[0]
  ) {
    return listing.images[0];
  }

  return DEFAULT_LISTING_IMAGE;
}

function getListingLocation(listing) {
  const zipCode = String(listing.zipCode || "").trim();

  return zipCode === "32816"
    ? "UCF Main Campus"
    : zipCode
      ? `ZIP ${zipCode}`
      : "Orlando, FL";
}

function ListingCard({ listing, openListing }) {
  function handleOpenListing() {
    openListing(listing);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openListing(listing);
    }
  }

  return (
    <article
      className="listing-card"
      onClick={handleOpenListing}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View listing for ${listing.title}`}
    >
      <div className="listing-image-container">
        <img
          src={getListingImage(listing)}
          alt={listing.title || "Marketplace listing"}
          width="600"
          height="400"
          loading="lazy"
          decoding="async"
        />

        <span className="price-badge">
          {formatPrice(listing.price)}
        </span>
      </div>

      <div className="listing-info">
        <h3>{listing.title}</h3>

        <p>{listing.condition || "Condition not provided"}</p>

        <small>
          📍 {getListingLocation(listing)}
        </small>

        <small>{formatDate(listing.createdAt)}</small>
      </div>
    </article>
  );
}

export default ListingCard;
