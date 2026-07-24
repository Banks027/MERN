import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Dashboard.css";

function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-message">
        <span className="dashboard-footer-shield">
          🛡
        </span>

        <div>
          <strong>Built by Knights, for Knights.</strong>

          <p>
            Thank you for keeping our community safe,
            smart, and supportive.
          </p>
        </div>
      </div>

      <nav className="dashboard-footer-links">
        <Link to="/safety">
          <span>🛡</span>
          Safety Tips
        </Link>

        <Link to="/guidelines">
          <span>♙</span>
          Community Guidelines
        </Link>

        <Link to="/report">
          <span>⚑</span>
          Report an Issue
        </Link>
      </nav>
    </footer>
  );
}

export default DashboardFooter;
