import React, { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "../styles/PostItem.css";

function PostItemPreferences() {
  const location = useLocation();
  const navigate = useNavigate();

  const listingDetails =
    location.state?.listingDetails;

  const selectedImages =
    location.state?.selectedImages || [];

  const paymentOptions = [
    "Cash",
    "Zelle",
    "Cash App",
    "Venmo",
  ];

  const meetupOptions = [
    "Student Union",
    "John C. Hitt Library",
    "Memory Mall",
    "Reflection Pond",
    "Addition Financial Arena",
    "Garage A",
    "Knights Plaza",
    "Engineering Building",
    "Ferrell Commons",
    "Trevor Colbourn Hall",
  ];

  const [paymentMethods, setPaymentMethods] =
    useState([]);

  const [meetupLocations, setMeetupLocations] =
    useState([]);

  const [buyerInformation, setBuyerInformation] =
    useState("");
    
  const [isPublishing, setIsPublishing] =
    useState(false);

  const [publishError, setPublishError] =
    useState("");

  const [formError, setFormError] = useState("");

  if (!listingDetails) {
    return (
      <Navigate
        to="/post-item"
        replace
      />
    );
  }

  const togglePaymentMethod = (method) => {
    setPaymentMethods((currentMethods) => {
      if (currentMethods.includes(method)) {
        return currentMethods.filter(
          (currentMethod) =>
            currentMethod !== method
        );
      }

      return [...currentMethods, method];
    });

    setFormError("");
  };

  const toggleMeetupLocation = (meetupLocation) => {
    setMeetupLocations((currentLocations) => {
      if (
        currentLocations.includes(meetupLocation)
      ) {
        return currentLocations.filter(
          (currentLocation) =>
            currentLocation !== meetupLocation
        );
      }

      return [
        ...currentLocations,
        meetupLocation,
      ];
    });

    setFormError("");
  };

  const handleBack = () => {
    navigate("/post-item");
  };

  const handlePublish = async (event) => {
    event.preventDefault();

    setFormError("");
    setPublishError("");

    if (paymentMethods.length === 0) {
      setFormError(
        "Please select at least one payment method."
      );
      return;
    }

    if (meetupLocations.length === 0) {
      setFormError(
        "Please select at least one meetup location."
      );
      return;
    }

    const completeListing = {
      ...listingDetails,
      paymentMethods,
      meetupLocations,
      buyerInformation: buyerInformation.trim(),
    };

    const submissionData = new FormData();

    Object.entries(completeListing).forEach(
      ([key, value]) => {
        if (Array.isArray(value)) {
          submissionData.append(
            key,
            JSON.stringify(value)
          );

          return;
        }

        submissionData.append(
          key,
          String(value)
        );
      }
    );

    if (selectedImages[0]) {
      submissionData.append(
        "image",
        selectedImages[0]
      );
    }

    setIsPublishing(true);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        credentials: "include",
        body: submissionData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to publish listing."
        );
      }

      navigate("/dashboard", {
        state: {
          message: "Listing published successfully.",
        },
      });
    } catch (error) {
      setPublishError(
        error.message || "Unable to publish listing."
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <main className="post-item-page">
      <header className="post-item-navbar">
        <div className="post-item-navbar-inner">
          <Link
            to="/dashboard"
            className="post-item-brand"
          >
            <span className="post-item-brand-icon">
              ♞
            </span>

            <span>
              Knight<span>Marketplace</span>
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="post-item-back-link"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="post-item-container">
        <div className="post-item-step-indicator">
          <div className="post-item-step completed">
            <span>✓</span>
            <div>
              <strong>Listing Details</strong>
              <small>Completed</small>
            </div>
          </div>

          <div className="post-item-step-line active"></div>

          <div className="post-item-step active">
            <span>2</span>
            <div>
              <strong>Preferences</strong>
              <small>Payment and meetup</small>
            </div>
          </div>
        </div>

        <div className="post-item-heading">
          <p>Final listing details</p>

          <h1>Payment & Meetup</h1>

          <span>
            Choose the payment methods you accept and
            the campus locations where buyers can meet
            you.
          </span>
        </div>

        <form
          className="post-item-form"
          onSubmit={handlePublish}
        >
          <div className="post-item-form-header">
            <div>
              <p>Step 2 of 2</p>
              <h2>Seller Preferences</h2>
            </div>

            <span>
              Select all that apply
            </span>
          </div>

          <div className="post-preferences-content">
            <section className="post-preference-section">
              <div className="post-preference-heading">
                <div className="post-preference-icon">
                  $
                </div>

                <div>
                  <h3>
                    Accepted Payment Methods
                  </h3>

                  <p>
                    Buyers will see which payment
                    methods you accept.
                  </p>
                </div>
              </div>

              <div className="post-option-grid payment-grid">
                {paymentOptions.map((method) => {
                  const isSelected =
                    paymentMethods.includes(method);

                  return (
                    <label
                      className={
                        isSelected
                          ? "post-option-card selected"
                          : "post-option-card"
                      }
                      key={method}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          togglePaymentMethod(
                            method
                          )
                        }
                      />

                      <span className="post-option-checkbox">
                        {isSelected ? "✓" : ""}
                      </span>

                      <span>{method}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="post-preference-section">
              <div className="post-preference-heading">
                <div className="post-preference-icon">
                  📍
                </div>

                <div>
                  <h3>
                    Preferred Meetup Locations
                  </h3>

                  <p>
                    Select every campus location where
                    you are comfortable meeting buyers.
                  </p>
                </div>
              </div>

              <div className="post-option-grid meetup-grid">
                {meetupOptions.map(
                  (meetupLocation) => {
                    const isSelected =
                      meetupLocations.includes(
                        meetupLocation
                      );

                    return (
                      <label
                        className={
                          isSelected
                            ? "post-option-card selected"
                            : "post-option-card"
                        }
                        key={meetupLocation}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleMeetupLocation(
                              meetupLocation
                            )
                          }
                        />

                        <span className="post-option-checkbox">
                          {isSelected ? "✓" : ""}
                        </span>

                        <span>
                          {meetupLocation}
                        </span>
                      </label>
                    );
                  }
                )}
              </div>
            </section>

            <section className="post-preference-section">
              <div className="post-preference-heading">
                <div className="post-preference-icon">
                  ✎
                </div>

                <div>
                  <h3>
                    Additional Information for Buyers
                  </h3>

                  <p>
                    This information will appear on
                    the listing for buyers to read.
                  </p>
                </div>
              </div>

              <div className="post-item-field">
                <label htmlFor="buyerInformation">
                  Meetup or payment instructions
                </label>

                <textarea
                  id="buyerInformation"
                  name="buyerInformation"
                  value={buyerInformation}
                  onChange={(event) =>
                    setBuyerInformation(
                      event.target.value
                    )
                  }
                  placeholder="Example: Available after 4 PM on weekdays. Please message before arriving."
                  rows="5"
                  maxLength="500"
                />

                <small>
                  {buyerInformation.length}/500
                  characters
                </small>
              </div>
            </section>

            {formError && (
              <p
                className="post-item-error-message post-preferences-error"
                role="alert"
              >
                {formError}
              </p>
            )}

            {publishError && (
              <p
                className="post-item-error-message post-preferences-error"
                role="alert"
              >
                {publishError}
              </p>
            )}
          </div>

          <div className="post-item-form-actions">
            <button
              type="button"
              className="post-item-cancel-button"
              onClick={handleBack}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="post-item-submit-button"
              disabled={isPublishing}
            >
              {isPublishing
                ? "Publishing..."
                : "Publish Listing"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PostItemPreferences;