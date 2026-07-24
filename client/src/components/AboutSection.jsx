import React from "react";
import { Link } from "react-router-dom";

function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-image">
        <div className="about-image-overlay">
          <span>Built by Knights</span>
        </div>
      </div>

      <div className="about-content">
        <p className="section-label">ABOUT US</p>

        <h2>
          A better marketplace for the <span>UCF community.</span>
        </h2>

        <p>
          KnightMarketplace gives UCF students one convenient place to buy
          and sell items from other students. It reduces waste, helps
          students save money, and creates stronger campus connections.
        </p>

        <ul>
          <li>Designed for students</li>
          <li>Focused on safety and trust</li>
          <li>Easy buying and selling</li>
          <li>Convenient campus exchanges</li>
        </ul>

        
      </div>
    </section>
  );
}

export default AboutSection;
