import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyKnightMarketplace from "../components/WhyKnightMarketplace";
import FeaturedListings from "../components/FeaturedListings";
import HowItWorks from "../components/HowItWorks";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import SignInPopup from "../components/SignInPopup";

function Home() {
  const location = useLocation();

  const [selectedListing, setSelectedListing] = useState(null);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState("");

  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] =
    useState(true);

  function openListing(listing) {
    setSelectedListing(listing);
  }

  function closeListing() {
    setSelectedListing(null);
    setShowSignInPopup(false);
    setPendingAction("");
  }

  function requireSignIn(action) {
    setPendingAction(action);
    setShowSignInPopup(true);
  }

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function viewAllListings() {
    requireSignIn("browse");
  }

  useEffect(() => {
  async function loadListings() {
    try {
      const response = await fetch("/api/listings?limit=4");

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
      console.error(error);
    } finally {
      setIsLoadingListings(false);
    }
  }

  loadListings();
}, []);

useEffect(() => {
    const returnedListingId = location.state?.listingId;

    if (!returnedListingId) {
      return;
    }

    const returnedListing = listings.find(
      (listing) =>
        String(listing._id) === String(returnedListingId)
    );

    if (returnedListing) {
      setSelectedListing(returnedListing);
    }

    if (location.state?.action) {
      setPendingAction(location.state.action);
    }

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  }, [location.state, listings]);

  return (
    <div className="website">
      <Navbar scrollToSection={scrollToSection} />

      <main>
        <Hero scrollToSection={scrollToSection} />

        <WhyKnightMarketplace />

        {isLoadingListings ? (
          <section className="listing-section">
            <h2>Loading listings...</h2>
          </section>
        ) : (
          <FeaturedListings
            filteredListings={listings}
            openListing={openListing}
            requireSignIn={requireSignIn}
            viewAllListings={viewAllListings}
          />
        )}

        <HowItWorks />

        <AboutSection />
      </main>

      <Footer scrollToSection={scrollToSection} />

      {selectedListing && (
        <div
          className="modal-backdrop"
          onClick={closeListing}
        >
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
                src={
                  selectedListing.images?.[0] ||
                  "/placeholder-image.png"
                }
                alt={selectedListing.title}
              />
            </div>

            <div className="listing-modal-content">
              <p className="listing-category">
                {selectedListing.category}
              </p>

              <h2>{selectedListing.title}</h2>

              <h3>
                {Number(selectedListing.price || 0).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  }
                )}
              </h3>

              <div className="listing-tags">
                <span>{selectedListing.condition}</span>

                <span>
                  📍{" "}
                  {selectedListing.zipCode === "32816"
                    ? "UCF Main Campus"
                    : selectedListing.zipCode
                      ? `ZIP ${selectedListing.zipCode}`
                      : "Orlando, FL"}
                </span>

                <span>
                  {selectedListing.createdAt
                    ? `Posted ${new Date(
                        selectedListing.createdAt
                      ).toLocaleDateString("en-US")}`
                    : "Recently posted"}
                </span>
              </div>

              <div className="modal-description">
                <h4>Description</h4>

                <p>{selectedListing.description}</p>
              </div>

              <div className="seller-box">
                <div className="seller-avatar">
                  {(selectedListing.sellerName ||
                    selectedListing.user?.displayName ||
                    selectedListing.user?.firstName ||
                    "K")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <small>Seller</small>

                  <strong>
                    {selectedListing.sellerName ||
                      selectedListing.user?.displayName ||
                      selectedListing.user?.firstName ||
                      "KnightMarketplace User"}
                  </strong>

                  <p>UCF Student</p>
                </div>
              </div>

              <button
                className="contact-seller-button"
                type="button"
                onClick={() => requireSignIn("contact")}
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      )}

      <SignInPopup
        showSignInPopup={showSignInPopup}
        setShowSignInPopup={setShowSignInPopup}
        selectedListing={selectedListing}
        pendingAction={pendingAction}
      />
    </div>
  );
}

export default Home;
