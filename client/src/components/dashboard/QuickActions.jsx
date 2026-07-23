import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";

function QuickActions() {
  const actions = [
    {
      icon: "＋",
      title: "Post an Item",
      description: "Sell to fellow Knights",
      path: "/create-listing",
    },
    {
      icon: "🏷",
      title: "My Listings",
      description: "Manage your items",
      path: "/my-listings",
    },
    {
      icon: "♡",
      title: "Saved Items",
      description: "View your favorites",
      path: "/saved-items",
    },
  ];

  return (
    <section className="dashboard-panel quick-actions-panel">
      <h2>Quick Actions</h2>

      <div className="quick-actions-list">
        {actions.map((action) => (
          <Link
            to={action.path}
            className="quick-action-card"
            key={action.title}
          >
            <span className="quick-action-icon">
              {action.icon}
            </span>

            <span>
              <strong>{action.title}</strong>
              <small>{action.description}</small>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
