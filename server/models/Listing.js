const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    /*
     * The account that created the listing.
     *
     * Seller name, email, profile picture, and verification status
     * remain in the User document and can be retrieved with populate().
     */
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Item title is required."],
      trim: true,
      minlength: [3, "Item title must be at least 3 characters long."],
      maxlength: [120, "Item title cannot exceed 120 characters."],
    },

    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price cannot be negative."],
    },

    category: {
      type: String,
      required: [true, "Category is required."],
      enum: {
        values: [
          "Textbooks",
          "Electronics",
          "Furniture",
          "Clothing",
          "Dorm Essentials",
          "School Supplies",
          "Sports & Recreation",
          "Tickets",
          "Free Items",
          "Other",
        ],
        message: "{VALUE} is not a supported category.",
      },
    },

    condition: {
      type: String,
      required: [true, "Item condition is required."],
      enum: {
        values: ["New", "Like New", "Good", "Fair", "Poor"],
        message: "{VALUE} is not a supported item condition.",
      },
    },

    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long."],
      maxlength: [2000, "Description cannot exceed 2000 characters."],
    },

    /*
     * Image URLs will be stored here after the image upload phase.
     * The first image will act as the listing's main thumbnail.
     */
    images: {
      type: [String],
      default: [],
      validate: {
        validator(images) {
          return images.length <= 5;
        },
        message: "A listing can contain no more than five images.",
      },
    },

    /*
     * This belongs to the listing instead of the User account because
     * a seller may choose a different contact number for each listing.
     */
    contactPhone: {
      type: String,
      required: [true, "A contact phone number is required."],
      trim: true,
      match: [
        /^\d{10}$/,
        "Phone number must contain exactly 10 digits.",
      ],
    },

    zipCode: {
      type: String,
      required: [true, "ZIP code is required."],
      trim: true,
      match: [
        /^\d{5}$/,
        "ZIP code must contain exactly five digits.",
      ],
    },

    status: {
      type: String,
      enum: {
        values: ["active", "reserved", "sold", "removed"],
        message: "{VALUE} is not a supported listing status.",
      },
      default: "active",
      index: true,
    },
    
    paymentMethods: {
      type: [String],
      enum: ["Cash", "Zelle", "Cash App", "Venmo"],
      required: true,
      validate: {
        validator: (methods) => methods.length > 0,
        message: "At least one payment method is required.",
      },
    },
    
    meetupLocations: {
      type: [String],
      enum: [
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
      ],
      required: true,
      validate: {
        validator: (locations) => locations.length > 0,
        message: "At least one meetup location is required.",
      },
    },
    
    buyerInformation: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    
    city: {
      type: String,
      trim: true,
      required: true,
    },
    
    state: {
      type: String,
      trim: true,
      required: true,
    },
    
    stateAbbreviation: {
      type: String,
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
      required: true,
    },
    
    latitude: {
      type: Number,
      required: true,
    },
    
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Common marketplace query:
 * retrieve active listings with the newest listings first.
 */
listingSchema.index({
  status: 1,
  createdAt: -1,
});

/*
 * Common profile query:
 * retrieve all listings belonging to one seller.
 */
listingSchema.index({
  seller: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Listing", listingSchema);