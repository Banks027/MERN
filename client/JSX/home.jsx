import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyKnightMarketplace from "../components/WhyKnightMarketplace";
import CategorySection from "../components/CategorySection";
import FeaturedListings from "../components/FeaturedListings";
import HowItWorks from "../components/HowItWorks";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";
import SignInPopup from "../components/SignInPopup";

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
      <Navbar scrollToSection={scrollToSection} />

      <main>
        <Hero
          search={search}
          setSearch={setSearch}
          scrollToSection={scrollToSection}
        />

        <WhyKnightMarketplace />

        <CategorySection
          setSearch={setSearch}
          scrollToSection={scrollToSection}
        />

        <FeaturedListings
          filteredListings={filteredListings}
          openListing={openListing}
          requireSignIn={requireSignIn}
          setSearch={setSearch}
        />

        <HowItWorks />

        <AboutSection />
      </main>

      <Footer scrollToSection={scrollToSection} />

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

                <span>
                  📍 {selectedListing.location}
                </span>

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

      <SignInPopup
        showSignInPopup={showSignInPopup}
        setShowSignInPopup={setShowSignInPopup}
      />
    </div>
  );
}

export default Home;
