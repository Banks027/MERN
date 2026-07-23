import React from "react";

function SearchBar({
  search,
  setSearch,
  scrollToSection,
}) {
  function handleSearch() {
    scrollToSection("listings");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="hero-search">
      <input
        type="text"
        placeholder='Search for items, such as "Textbook"'
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
