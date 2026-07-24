import React from "react";

function FeatureCard({ icon, title, description }) {
  return (
    <article className="purpose-card">
      <div className="purpose-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
}

export default FeatureCard;
