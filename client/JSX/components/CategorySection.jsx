import React from "react";
import CategoryCard from "./CategoryCard";

const categories = [
  { name: "Textbooks", icon: "📚" },
  { name: "Furniture", icon: "🪑" },
  { name: "Electronics", icon: "💻" },
  { name: "Housing", icon: "🏠" },
  { name: "Clothing", icon: "👕" },
  { name: "Tickets", icon: "🎟️" },
];

function CategorySection({ setSearch, scrollToSection }) {
  return (
    <section className="categories-section" id="categories">
      <div className="section-heading left-heading">
        <p>EXPLORE</p>
        <h2>Popular Categories</h2>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            category={category}
            setSearch={setSearch}
            scrollToSection={scrollToSection}
          />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
