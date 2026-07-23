import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/PostItem.css";

function PostItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    zipcode: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
  });

  const [location, setLocation] = useState(null);
  const [zipError, setZipError] = useState("");
  const [isLookingUpZip, setIsLookingUpZip] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));

    if (name === "zipcode") {
      setLocation(null);
      setZipError("");
    }
  };

  const handleZipLookup = async () => {
    setZipError("");
    setLocation(null);

    const cleanedZipcode = formData.zipcode.trim();

    if (!/^\d{5}$/.test(cleanedZipcode)) {
      setZipError(
        "ZIP code must contain exactly five digits."
      );
      return;
    }

    setIsLookingUpZip(true);

    try {
      const response = await fetch(
        `/api/zipcode/${cleanedZipcode}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to find ZIP code."
        );
      }

      setLocation(data);
    } catch (error) {
      setZipError(
        error.message || "Unable to verify ZIP code."
      );
    } finally {
      setIsLookingUpZip(false);
    }
  };

  const handleContinue = (event) => {
    event.preventDefault();

    const cleanedPhone = formData.sellerPhone.replace(
      /\D/g,
      ""
    );

    if (cleanedPhone.length !== 10) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!location) {
      setZipError(
        "Please verify the ZIP code before continuing."
      );
      return;
    }

    const listingDetails = {
      ...formData,
      zipcode: formData.zipcode.trim(),
      sellerName: formData.sellerName.trim(),
      sellerEmail: formData.sellerEmail.trim(),
      sellerPhone: cleanedPhone,
      city: location.city,
      state: location.state,
      stateAbbreviation: location.abbreviation,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    navigate("/post-item/preferences", {
      state: {
        listingDetails,
      },
    });
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
          <div className="post-item-step active">
            <span>1</span>

            <div>
              <strong>Listing Details</strong>
              <small>Item information</small>
            </div>
          </div>

          <div className="post-item-step-line"></div>

          <div className="post-item-step">
            <span>2</span>

            <div>
              <strong>Preferences</strong>
              <small>Payment and meetup</small>
            </div>
          </div>
        </div>

        <div className="post-item-heading">
          <p>Sell to the UCF community</p>

          <h1>Post an Item</h1>

          <span>
            Enter your item information before choosing your
            payment and meetup preferences.
          </span>
        </div>

        <form
          className="post-item-form"
          onSubmit={handleContinue}
        >
          <div className="post-item-form-header">
            <div>
              <p>Step 1 of 2</p>
              <h2>Listing Details</h2>
            </div>

            <span>All fields are required</span>
          </div>

          <div className="post-item-form-grid">
            <div className="post-item-field post-item-full-width">
              <label htmlFor="title">
                Item Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Dell 27-inch Monitor"
                required
              />
            </div>

            <div className="post-item-field">
              <label htmlFor="price">
                Price
              </label>

              <div className="post-item-price-input">
                <span>$</span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="post-item-field">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a category
                </option>

                <option value="textbooks">
                  Textbooks
                </option>

                <option value="electronics">
                  Electronics
                </option>

                <option value="furniture">
                  Furniture
                </option>

                <option value="clothing">
                  Clothing
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div className="post-item-field post-item-full-width">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item and its condition."
                rows="6"
                required
              />

              <small>
                Include the condition, age, and any important
                details about the item.
              </small>
            </div>

            <div className="post-item-field">
              <label htmlFor="sellerName">
                Seller Name
              </label>

              <input
                id="sellerName"
                name="sellerName"
                type="text"
                value={formData.sellerName}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="post-item-field">
              <label htmlFor="sellerEmail">
                Seller Email
              </label>

              <input
                id="sellerEmail"
                name="sellerEmail"
                type="email"
                value={formData.sellerEmail}
                onChange={handleChange}
                placeholder="example@ucf.edu"
                required
              />
            </div>

            <div className="post-item-field post-item-full-width">
              <label htmlFor="sellerPhone">
                Seller Phone
              </label>

              <input
                id="sellerPhone"
                name="sellerPhone"
                type="tel"
                value={formData.sellerPhone}
                onChange={handleChange}
                placeholder="Example: 407-555-1234"
                required
              />

              <small>
                Enter a valid 10-digit phone number.
              </small>
            </div>

            <div className="post-item-field post-item-full-width">
              <label htmlFor="zipcode">
                ZIP Code
              </label>

              <div className="post-item-zipcode-row">
                <input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  inputMode="numeric"
                  maxLength="5"
                  pattern="[0-9]{5}"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="Enter five-digit ZIP code"
                  required
                />

                <button
                  type="button"
                  className="post-item-verify-button"
                  onClick={handleZipLookup}
                  disabled={isLookingUpZip}
                >
                  {isLookingUpZip
                    ? "Looking up..."
                    : "Verify ZIP Code"}
                </button>
              </div>

              {location && (
                <p className="post-item-success-message">
                  ✓ Verified location: {location.city},{" "}
                  {location.abbreviation}
                </p>
              )}

              {zipError && (
                <p
                  className="post-item-error-message"
                  role="alert"
                >
                  {zipError}
                </p>
              )}
            </div>
          </div>

          <div className="post-item-form-actions">
            <Link
              to="/dashboard"
              className="post-item-cancel-button"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="post-item-submit-button"
            >
              Continue
              <span>→</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default PostItem;