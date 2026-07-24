import React from "react";
import "../../styles/Dashboard.css";

function DashboardStats() {
  const stats = [
    {
      icon: "🏷",
      number: "5",
      title: "Active Listings",
      link: "Manage listings →",
    },
    {
      icon: "◉",
      number: "23",
      title: "Saved Items",
      link: "View favorites →",
    },
    {
      icon: "💬",
      number: "4",
      title: "Messages",
      link: "View inbox →",
    },
    {
      icon: "↗",
      number: "12",
      title: "Profile Views",
      link: "Last 7 days",
    },
  ];

  return (
    <section className="dashboard-panel dashboard-hub">
      <h2>Your Marketplace Hub</h2>

      <div className="dashboard-stats-grid">
        {stats.map((stat) => (
          <article className="dashboard-stat-card" key={stat.title}>
            <span className="dashboard-stat-icon">
              {stat.icon}
            </span>

            <div>
              <strong className="dashboard-stat-number">
                {stat.number}
              </strong>

              <p>{stat.title}</p>

              <small>{stat.link}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardStats;
