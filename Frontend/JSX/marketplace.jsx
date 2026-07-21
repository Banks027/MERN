import { useState } from "react";

import "../CSS/marketplace.css";

import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import CategorySection from "../components/CategorySection";
import ListingCard from "../components/ListingCard";

const listings = [
  {
    id: 1,
    title: "MacBook Air M2",
    price: 800,
    condition: "Like New",
    location: "Student Union",
    date: "2 hours ago",
    image: "https://placehold.co/600x400?text=MacBook",
    category: "Electronics",
  },
  {
    id: 2,
    title: "TI-84 Plus CE",
    price: 70,
    condition: "Excellent",
    location: "John C. Hitt Library",
    date: "Today",
    image: "https://placehold.co/600x400?text=Calculator",
    category: "Textbooks",
  },
  {
    id: 3,
    title: "Mini Fridge",
    price: 60,
    condition: "Good",
    location: "Towers",
    date: "Yesterday",
    image: "https://placehold.co/600x400?text=Mini+Fridge",
    category: "Furniture",
  },
  {
    id: 4,
    title: "Nintendo Switch OLED",
    price: 240,
    condition: "Like New",
    location: "NorthView",
    date: "1 day ago",
    image: "https://placehold.co/600x400?text=Switch",
    category: "Electronics",
  },
  {
    id: 5,
    title: "Dell Monitor",
    price: 110,
    condition: "Excellent",
    location: "Garage C",
    date: "Today",
    image: "https://placehold.co/600x400?text=Monitor",
    category: "Electronics",
  },
  {
    id: 6,
    title: "UCF Nike Hoodie",
    price: 25,
    condition: "Good",
    location: "Memory Mall",
    date: "3 days ago",
    image: "https://placehold.co/600x400?text=Hoodie",
    category: "Clothing",
  },
];

export default function Marketplace() {

  const [search, setSearch] = useState("");

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const openListing = (listing) => {
    alert(`Open listing:\n${listing.title}`);
  };

  const requireSignIn = () => {
    alert("Please sign in to save items.");
  };

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(search.toLowerCase()) ||
    listing.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="marketplace-page">

      <Navbar scrollToSection={scrollToSection} />

      {/* Hero */}

      <section className="marketplace-header">

        <h1>Browse Listings</h1>

        <p>
          Discover textbooks, electronics, furniture,
          clothing, and more from fellow Knights.
        </p>

        <SearchBar
          search={search}
          setSearch={setSearch}
          scrollToSection={scrollToSection}
        />

      </section>

      <CategorySection
        setSearch={setSearch}
        scrollToSection={scrollToSection}
      />

      {/* Listings */}

      <section
        className="market-section"
        id="listings"
      >

        <div className="market-sidebar">

          <h2>Filters</h2>

          <div className="filter-group">

            <h3>Condition</h3>

            <label>
              <input type="checkbox" />
              New
            </label>

            <label>
              <input type="checkbox" />
              Like New
            </label>

            <label>
              <input type="checkbox" />
              Good
            </label>

            <label>
              <input type="checkbox" />
              Used
            </label>

          </div>

          <button className="reset-btn">
            Reset Filters
          </button>

        </div>

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

      </section>

      <div className="pagination">

        <button>Previous</button>

        <button className="current">
          1
        </button>

        <button>2</button>

        <button>3</button>

        <button>Next</button>

      </div>

      <Footer scrollToSection={scrollToSection} />

    </div>
  );
}
