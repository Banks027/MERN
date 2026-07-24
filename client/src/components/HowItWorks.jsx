import React from "react";

function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="section-heading">
        <p>SIMPLE AND STUDENT-FOCUSED</p>

        <h2>How It Works</h2>

        <p>Start buying and selling in three simple steps.</p>
      </div>

      <div className="steps-grid">
        <article className="step-card">
          <span>1</span>

          <div className="step-icon">👤</div>

          <h3>Create Your Account</h3>

          <p>
            Register using your email and verify your account.
          </p>
        </article>

        <article className="step-card">
          <span>2</span>

          <div className="step-icon">🔍</div>

          <h3>Browse or Post</h3>

          <p>
            Find what you need or create your own marketplace listing.
          </p>
        </article>

        <article className="step-card">
          <span>3</span>

          <div className="step-icon">💬</div>

          <h3>Connect and Exchange</h3>

          <p>
            Message other Knights and arrange a safe campus exchange.
          </p>
        </article>
      </div>
    </section>
  );
}

export default HowItWorks;
