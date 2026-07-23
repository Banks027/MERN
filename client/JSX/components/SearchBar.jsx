import React from "react";

function SearchBar({ search, setSearch, scrollToSection }) {
  return (
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
  );
}

export default SearchBar;
