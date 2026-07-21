import React from "react";
import ListingCard from "./ListingCard";

function FeaturedListings({
  filteredListings,
  openListing,
  requireSignIn,
  setSearch,
}) {
  return (
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
            <ListingCard
              key={listing.id}
              listing={listing}
              openListing={openListing}
              requireSignIn={requireSignIn}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h3>No listings found</h3>

          <p>Try searching for another item or category.</p>

          <button
            type="button"
            onClick={() => setSearch("")}
          >
            Clear Search
          </button>
        </div>
      )}
    </section>
  );
}

export default FeaturedListings;
