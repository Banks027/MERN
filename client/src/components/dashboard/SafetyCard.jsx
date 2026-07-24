import React from "react";
import "../../styles/Dashboard.css";

function SafetyCard() {
  return (
    <section className="dashboard-safety-card">
      <div className="dashboard-safety-icon">
        🛡
      </div>

      <div>
        <h2>
          Students only.
          <br />
          Knights only.
        </h2>

        <p>
          A safe, trusted space built exclusively for UCF students.
        </p>

        <button type="button">
          Learn more about safety
        </button>
      </div>
    </section>
  );
}

export default SafetyCard;
