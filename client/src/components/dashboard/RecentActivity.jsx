import React from "react";
import "../../styles/Dashboard.css";

function RecentActivity() {
  const activities = [
    {
      avatar: "AM",
      title: "Alex M. replied to your listing",
      detail: "Calculus: Early Transcendentals",
      time: "2m ago",
      icon: "💬",
    },
    {
      avatar: "KM",
      title: "Your item sold!",
      detail: "Logitech MX Keys Keyboard",
      time: "1h ago",
      icon: "✓",
    },
    {
      avatar: "JT",
      title: "New message from Jordan T.",
      detail: "Regarding your item: Desk Chair",
      time: "3h ago",
      icon: "💬",
    },
    {
      avatar: "MB",
      title: "Your listing is getting views",
      detail: "MacBook Air M2",
      time: "5h ago",
      icon: "◉",
    },
    {
      avatar: "$",
      title: "New offer received",
      detail: "Physics for Scientists Textbook",
      time: "1d ago",
      icon: "$",
    },
  ];

  return (
    <section className="dashboard-panel recent-activity-panel">
      <div className="dashboard-section-heading">
        <h2>Recent Activity</h2>
        <button type="button">View all</button>
      </div>

      <div className="recent-activity-list">
        {activities.map((activity) => (
          <article
            className="recent-activity-item"
            key={`${activity.title}-${activity.time}`}
          >
            <div className="activity-avatar">
              {activity.avatar}
            </div>

            <div className="activity-content">
              <strong>{activity.title}</strong>
              <p>{activity.detail}</p>
              <small>{activity.time}</small>
            </div>

            <span className="activity-status">
              {activity.icon}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecentActivity;
