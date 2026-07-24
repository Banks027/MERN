import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";

function DashboardNavbar() {
  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-inner">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon">♞</span>

          <span>
            Knight<strong>Marketplace</strong>
          </span>
        </Link>

        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search for textbooks, furniture, tickets, and more..."
          />

          <button type="button" aria-label="Search">
            ⌕
          </button>
        </div>

        <select
          className="dashboard-category-select"
          defaultValue="all"
          aria-label="Listing category"
        >
          <option value="all">All Categories</option>
          <option value="textbooks">Textbooks</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="tickets">Tickets</option>
        </select>

        <nav className="dashboard-nav-links">
          <Link to="/messages" className="dashboard-nav-item">
            <span className="dashboard-nav-icon">💬</span>
            <small>Messages</small>
          </Link>

          <Link to="/notifications" className="dashboard-nav-item">
            <span className="dashboard-nav-icon">🔔</span>
            <small>Notifications</small>
          </Link>

          <Link to="/profile" className="dashboard-profile">
            <div className="dashboard-profile-avatar">K</div>
            <span>Kedenise</span>
            <span>⌄</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default DashboardNavbar;
