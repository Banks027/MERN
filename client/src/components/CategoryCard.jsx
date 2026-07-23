import React from "react";

function CategoryCard({ category, setSearch, scrollToSection }) {
  const handleClick = () => {
    setSearch(category.name);
    scrollToSection("listings");
  };

  return (
    <button
      className="category-card"
      type="button"
      onClick={handleClick}
    >
      <span>{category.icon}</span>
      <strong>{category.name}</strong>
      <small>View listings</small>
    </button>
  );
}

export default CategoryCard;
