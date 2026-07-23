import React from "react";
import "../../styles/Dashboard.css";

function TrendingCategories() {
  const categories = [
    {
      icon: "📚",
      name: "Textbooks",
      count: "1,248 listings",
    },
    {
      icon: "👕",
      name: "Clothing",
      count: "419 listings",
    },
    {
      icon: "🛋",
      name: "Furniture",
      count: "842 listings",
    },
    {
      icon: "🎟",
      name: "Tickets",
      count: "312 listings",
    },
    {
      icon: "💻",
      name: "Electronics",
      count: "678 listings",
    },
    {
      icon: "🚗",
      name: "Vehicles",
      count: "205 listings",
    },
    {
      icon: "🏠",
      name: "Housing",
      count: "523 listings",
    },
    {
      icon: "▦",
      name: "All Categories",
      count: "4,227 listings",
    },
  ];

  return (
    <section className="dashboard-panel trending-section">
      <div className="dashboard-section-heading">
        <h2>Trending Categories</h2>
        <button type="button">Explore all →</button>
      </div>

      <div className="trending-categories-grid">
        {categories.map((category) => (
          <button
            type="button"
            className="trending-category"
            key={category.name}
          >
            <span className="trending-category-icon">
              {category.icon}
            </span>

            <span className="trending-category-name">
              {category.name}
            </span>

            <small>{category.count}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export default TrendingCategories;
