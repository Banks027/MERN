import React from "react";
import "../../styles/Dashboard.css";

function WelcomeBanner() {
  return (
    <section className="dashboard-welcome">
      <div className="dashboard-welcome-overlay"></div>

      <div className="dashboard-welcome-content">
        <p className="dashboard-welcome-label">
          Welcome back
        </p>

        <h1>
          Welcome back,
          <span>Kedenise</span>
        </h1>

        <p className="dashboard-welcome-description">
          Find great deals, connect with fellow Knights,
          and make the most of campus life.
        </p>

        <div className="dashboard-student-details">
          <span>♟ UCF Student</span>
          <span>• Joined August 2023</span>
          <span>🛡 Verified</span>
        </div>
      </div>
    </section>
  );
}

export default WelcomeBanner;
