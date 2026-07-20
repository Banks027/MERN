import "../App.css";

function Home() {
  const categories = [
    { icon: "🛍️", name: "For Sale" },
    { icon: "📚", name: "Textbooks" },
    { icon: "🏠", name: "Housing" },
    { icon: "🛋️", name: "Furniture" },
    { icon: "💻", name: "Electronics" },
    { icon: "🚗", name: "Vehicles" },
    { icon: "👕", name: "Clothing" },
    { icon: "＋", name: "More" },
  ];

  const featuredListings = [
    {
      name: "MacBook Air M2",
      price: "$800",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Study Desk",
      price: "$45",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Mountain Bike",
      price: "$200",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: '27" Monitor',
      price: "$120",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
    },
  ];

  const recentListings = [
    {
      name: "College Textbooks",
      price: "$50",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Desk Chair",
      price: "$30",
      location: "Orlando, FL",
      image:
        "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-knight">♞</span>
          <span>Knight</span>
          <strong>Market</strong>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#categories">Categories</a>
          <a href="#listings">My Listings</a>
          <a href="#messages">Messages</a>
        </nav>

        <div className="nav-actions">
          <button className="notification-button" aria-label="Notifications">
            🔔
          </button>

          <button className="profile-button" aria-label="Profile">
            👤
          </button>

          <button className="post-item-button">Post an Item</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <h1>
              Buy. Sell.
              <br />
              Connect.
              <br />
              <span>Charge On.</span>
            </h1>

            <p>
              The trusted marketplace
              <br />
              for UCF students.
            </p>

            <div className="hero-buttons">
              <button className="gold-button">Get Started</button>
              <button className="white-button">Learn More</button>
            </div>
          </div>
        </section>

        <section className="content-section category-section" id="categories">
          <div className="section-title-row">
            <h2>Browse Categories</h2>
            <a href="#marketplace">View all</a>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <button className="category-card" key={category.name}>
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section
          className="content-section listing-sections"
          id="marketplace"
        >
          <div className="featured-column">
            <div className="section-title-row">
              <h2>Featured Listings</h2>
            </div>

            <div className="featured-grid">
              {featuredListings.map((item) => (
                <article className="listing-card" key={item.name}>
                  <div className="listing-image-wrapper">
                    <img src={item.image} alt={item.name} />

                    <button
                      className="heart-button"
                      aria-label="Save listing"
                    >
                      ♡
                    </button>
                  </div>

                  <div className="listing-details">
                    <h3>{item.name}</h3>
                    <strong>{item.price}</strong>
                    <p>{item.location}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="recent-column">
            <div className="section-title-row">
              <h2>Recently Posted</h2>
              <a href="#marketplace">View all</a>
            </div>

            <div className="recent-grid">
              {recentListings.map((item) => (
                <article className="listing-card" key={item.name}>
                  <div className="listing-image-wrapper">
                    <img src={item.image} alt={item.name} />

                    <button
                      className="heart-button"
                      aria-label="Save listing"
                    >
                      ♡
                    </button>
                  </div>

                  <div className="listing-details">
                    <h3>{item.name}</h3>
                    <strong>{item.price}</strong>
                    <p>{item.location}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="why-section">
          <h2>Why KnightMarket?</h2>

          <div className="benefit-grid">
            <article className="benefit-card">
              <span>🛡️</span>

              <div>
                <h3>Safe &amp; Secure</h3>
                <p>Verified UCF students and safe meetups.</p>
              </div>

              <strong>›</strong>
            </article>

            <article className="benefit-card">
              <span>👥</span>

              <div>
                <h3>Built for Knights</h3>
                <p>Designed for UCF students, by students.</p>
              </div>

              <strong>›</strong>
            </article>

            <article className="benefit-card">
              <span>⚡</span>

              <div>
                <h3>Easy &amp; Convenient</h3>
                <p>Buy, sell, and connect all in one place.</p>
              </div>

              <strong>›</strong>
            </article>
          </div>

          <div className="statistics-grid">
            <div className="statistic">
              <span>👥</span>

              <div>
                <strong>1,200+</strong>
                <p>Students</p>
              </div>
            </div>

            <div className="statistic">
              <span>📦</span>

              <div>
                <strong>400+</strong>
                <p>Listings</p>
              </div>
            </div>

            <div className="statistic">
              <span>▦</span>

              <div>
                <strong>50+</strong>
                <p>Categories</p>
              </div>
            </div>

            <div className="statistic">
              <span>🛡️</span>

              <div>
                <strong>95%</strong>
                <p>Positive Reviews</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand-column">
            <a className="brand footer-brand" href="#home">
              <span className="brand-knight">♞</span>
              <span>Knight</span>
              <strong>Market</strong>
            </a>

            <p>
              The exclusive marketplace
              <br />
              for UCF students.
            </p>

            <div className="social-links">
              <a href="#instagram">◎</a>
              <a href="#tiktok">♪</a>
              <a href="#twitter">♥</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Marketplace</h3>
            <a href="#marketplace">All Listings</a>
            <a href="#categories">Categories</a>
            <a href="#marketplace">How It Works</a>
            <a href="#marketplace">Safety Tips</a>
          </div>

          <div className="footer-column">
            <h3>Company</h3>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <a href="#help">Help Center</a>
            <a href="#report">Report an Issue</a>
            <a href="#guidelines">Community Guidelines</a>
          </div>

          <div className="ucf-mark">
            <span>UCF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
