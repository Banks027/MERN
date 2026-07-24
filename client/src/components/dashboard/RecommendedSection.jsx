import React from "react";
import "../../styles/Dashboard.css";

function RecommendedSection() {
  const recommendations = [
    {
      title: "Physics for Scientists",
      price: "$70",
      condition: "4th Edition",
      image:
        "https://loremflickr.com/500/400/physics,textbook?lock=21",
    },
    {
      title: "Study Desk",
      price: "$60",
      condition: "Good condition",
      image:
        "https://loremflickr.com/500/400/study-desk?lock=22",
    },
    {
      title: "Coffee Maker",
      price: "$40",
      condition: "Like new",
      image:
        "https://loremflickr.com/500/400/coffee-maker?lock=23",
    },
    {
      title: "Adidas Shoes",
      price: "$55",
      condition: "Size 10.5",
      image:
        "https://loremflickr.com/500/400/sneakers,shoes?lock=24",
    },
    {
      title: "Blue Yeti Microphone",
      price: "$35",
      condition: "Great condition",
      image:
        "https://loremflickr.com/500/400/microphone?lock=25",
    },
  ];

  return (
    <section className="dashboard-panel recommended-section">
      <div className="dashboard-section-heading">
        <div>
          <h2>Recommended for You</h2>
          <p>Based on your activity</p>
        </div>

        <button type="button">View all →</button>
      </div>

      <div className="recommended-grid">
        {recommendations.map((item) => (
          <article className="recommended-card" key={item.title}>
            <div className="recommended-image">
              <img src={item.image} alt={item.title} />
              <span>{item.price}</span>
            </div>

            <h3>{item.title}</h3>
            <p>{item.condition}</p>
            <small>UCF Campus</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedSection;
