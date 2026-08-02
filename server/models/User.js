const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    phone: {
      type: String,
      default: "",
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    passwordHash: {
      type: String,
      default: null,
      select: false,
    },

    authProviders: {
      type: [String],
      enum: ["google", "local"],
      default: [],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    emailVerificationTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpiresAt: {
      type: Date,
      default: null,
    },
    
    emailVerificationLastSentAt: {
      type: Date,
      default: null,
    },

    passwordSetAt: {
      type: Date,
      default: null,
    },

    verifiedStudent: {
      type: Boolean,
      default: false,
    },

    studentEmail: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },

    studentEmailVerifiedAt: {
      type: Date,
      default: null,
    },

    studentEmailVerificationTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    studentEmailVerificationExpiresAt: {
      type: Date,
      default: null,
    },

    studentEmailVerificationLastSentAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);