import React from "react";
import { Link } from "react-router-dom";

import "../styles/About.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">
          <p className="section-label">ABOUT US</p>

          <h1>
            Learn More About <span>KnightMarketplace</span>
          </h1>

          <p className="about-hero-description">
            KnightMarketplace is a student-focused marketplace created to help
            UCF students buy, sell, and connect safely with one another.
          </p>

          <Link
            to="/listings"
            className="primary-button"
          >
            Browse Listings
          </Link>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-story">

        <div className="about-story-image">
          <div className="about-story-badge">
            Built by Knights
          </div>
        </div>

        <div className="about-story-content">

          <p className="section-label">
            OUR STORY
          </p>

          <h2>
            Connecting the <span>UCF Community</span>
          </h2>

          <p>
            KnightMarketplace was created to give students a trusted place to
            buy and sell textbooks, electronics, furniture, clothing, and more.
            Rather than relying on scattered social media posts, students have
            one centralized marketplace designed specifically for campus life.
          </p>

          <ul>
            <li>Designed specifically for UCF students</li>
            <li>Encourages safe campus exchanges</li>
            <li>Makes buying and selling simple</li>
            <li>Supports sustainability by reusing items</li>
          </ul>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default About;