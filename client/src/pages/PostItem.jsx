import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/PostItem.css";

function PostItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    description: "",
    zipCode: "",
    contactPhone: "",
  });

  const maximumImageSize = 5 * 1024 * 1024;

  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const [selectedImages, setSelectedImages] =
    useState([]);

  const [imageError, setImageError] =
    useState("");

  const [location, setLocation] = useState(null);
  const [zipError, setZipError] = useState("");
  const [isLookingUpZip, setIsLookingUpZip] =
    useState(false);

  const imagePreviews = useMemo(
    () =>
      selectedImages.map((image) => ({
        file: image,
        previewUrl: URL.createObjectURL(image),
      })),
    [selectedImages]
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [imagePreviews]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));

    if (name === "zipCode") {
      setLocation(null);
      setZipError("");
    }
  };

  const handleImageSelection = (event) => {
    const selectedFile = event.target.files?.[0];

    setImageError("");

    if (!selectedFile) {
      return;
    }

    if (!allowedImageTypes.includes(selectedFile.type)) {
      setImageError(
        "Only JPEG, PNG, and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (selectedFile.size > maximumImageSize) {
      setImageError(
        "The image must be 5 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    setSelectedImages([selectedFile]);

    event.target.value = "";
  };

  const removeSelectedImage = (imageIndex) => {
    setSelectedImages((currentImages) =>
      currentImages.filter(
        (_, currentIndex) =>
          currentIndex !== imageIndex
      )
    );

    setImageError("");
  };

  const lookupZipCode = async () => {
    const cleanedZipCode = formData.zipCode.trim();

    if (!/^\d{5}$/.test(cleanedZipCode)) {
      throw new Error(
        "ZIP code must contain exactly five digits."
      );
    }

    const response = await fetch(
      `/api/zipcode/${cleanedZipCode}`
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
          data.message ||
          "Unable to find ZIP code."
      );
    }

    return {
      city: data.city,
      state: data.state,
      abbreviation: data.abbreviation,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
    };
  };

  const handleZipLookup = async () => {
    setZipError("");
    setLocation(null);
    setIsLookingUpZip(true);

    try {
      const verifiedLocation = await lookupZipCode();
      setLocation(verifiedLocation);
    } catch (error) {
      setZipError(
        error.message || "Unable to verify ZIP code."
      );
    } finally {
      setIsLookingUpZip(false);
    }
  };

  const handleContinue = async (event) => {
    event.preventDefault();

    setZipError("");

    const cleanedPhone = formData.contactPhone.replace(
      /\D/g,
      ""
    );

    if (cleanedPhone.length !== 10) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    let verifiedLocation = location;

    if (!verifiedLocation) {
      setIsLookingUpZip(true);

      try {
        verifiedLocation = await lookupZipCode();
        setLocation(verifiedLocation);
      } catch (error) {
        setZipError(
          error.message || "Unable to verify ZIP code."
        );
        return;
      } finally {
        setIsLookingUpZip(false);
      }
    }

    const listingDetails = {
      title: formData.title.trim(),
      price: Number(formData.price),
      category: formData.category,
      condition: formData.condition,
      description: formData.description.trim(),
      contactPhone: cleanedPhone,
      zipCode: formData.zipCode.trim(),
      city: verifiedLocation.city,
      state: verifiedLocation.state,
      stateAbbreviation:
        verifiedLocation.abbreviation,
      latitude: verifiedLocation.latitude,
      longitude: verifiedLocation.longitude,
    };

    navigate("/post-item/preferences", {
      state: {
        listingDetails,
        selectedImages,
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

                <option value="Textbooks">
                  Textbooks
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Furniture">
                  Furniture
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Dorm Essentials">
                  Dorm Essentials
                </option>

                <option value="School Supplies">
                  School Supplies
                </option>

                <option value="Sports & Recreation">
                  Sports & Recreation
                </option>

                <option value="Tickets">
                  Tickets
                </option>

                <option value="Free Items">
                  Free Items
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="post-item-field">
              <label htmlFor="condition">
                Condition
              </label>

              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a condition
                </option>

                <option value="New">New</option>

                <option value="Like New">
                  Like New
                </option>

                <option value="Good">Good</option>

                <option value="Fair">Fair</option>

                <option value="Poor">Poor</option>
              </select>
            </div>

            <div className="post-item-field">
              <label htmlFor="contactPhone">
                Contact Phone
              </label>

              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Example: 407-555-1234"
                required
              />

              <small>
                Enter a valid 10-digit phone number.
              </small>
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
                placeholder="Describe the item, age, and any important details."
                rows="6"
                required
              />

              <small>
                Include the age and any important details
                about the item.
              </small>
            </div>

            <div className="post-item-field post-item-full-width">
              <label htmlFor="listingImages">
                Item Image
              </label>

              <div className="post-item-image-upload">
                <input
                  id="listingImages"
                  name="listingImages"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelection}
                />

                <div className="post-item-image-upload-content">
                  <strong>Choose item image</strong>

                  <span>
                    JPEG, PNG, or WebP. Maximum 5 MB.
                  </span>

                  <small>
                    {selectedImages.length === 1
                      ? "Image selected"
                      : "No image selected"}
                  </small>
                  
                </div>
              </div>

              {imageError && (
                <p
                  className="post-item-error-message"
                  role="alert"
                >
                  {imageError}
                </p>
              )}

              {imagePreviews.length > 0 && (
                <div className="post-item-image-preview-grid">
                  {imagePreviews.map(
                    (image, imageIndex) => (
                      <div
                        className="post-item-image-preview"
                        key={`${image.file.name}-${image.file.lastModified}-${imageIndex}`}
                      >
                        <img
                          src={image.previewUrl}
                          alt={`Selected item preview ${
                            imageIndex + 1
                          }`}
                        />

                        <button
                          type="button"
                          className="post-item-remove-image-button"
                          onClick={() =>
                            removeSelectedImage(imageIndex)
                          }
                          aria-label={`Remove ${image.file.name}`}
                        >
                          ×
                        </button>

                        <span className="post-item-image-name">
                          {image.file.name}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}

              <small>
                This image will be used as the listing thumbnail.
              </small>
            </div>

            <div className="post-item-field post-item-full-width">
              <label htmlFor="zipCode">
                ZIP Code
              </label>

              <div className="post-item-zipcode-row">
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  inputMode="numeric"
                  maxLength="5"
                  pattern="[0-9]{5}"
                  value={formData.zipCode}
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