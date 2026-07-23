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

    passwordSetAt: {
      type: Date,
      default: null,
    },

    verifiedStudent: {
      type: Boolean,
      default: false,
    },

    university: {
      type: String,
      default: null,
    },

    sheerIdVerifiedAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
