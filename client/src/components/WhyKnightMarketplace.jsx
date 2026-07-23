import React from "react";
import FeatureCard from "./FeatureCard";

function WhyKnightMarketplace() {
  return (
    <section className="purpose-section">
      <div className="section-heading">
        <p>OUR PURPOSE</p>

        <h2>
          Why <span>KnightMarketplace</span> Exists
        </h2>

        <p>
          We created KnightMarketplace to make campus commerce simple,
          safer, affordable, and student-focused.
        </p>
      </div>

      <div className="purpose-grid">
        <FeatureCard
          icon="🎓"
          title="Student-Only Access"
          description="A marketplace designed for UCF students and the campus community."
        />

        <FeatureCard
          icon="🛡️"
          title="Safer Connections"
          description="Connect with verified students and arrange exchanges in public campus locations."
        />

        <FeatureCard
          icon="🏷️"
          title="Affordable for Knights"
          description="Find affordable textbooks, furniture, electronics, clothing, and more."
        />

        <FeatureCard
          icon="⚡"
          title="Simple and Convenient"
          description="Browse, post, save, and message without leaving the student marketplace."
        />
      </div>
    </section>
  );
}

export default WhyKnightMarketplace;
