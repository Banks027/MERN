const mongoose = require("mongoose");

const authSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    userAgent: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * MongoDB automatically removes expired session records.
 * Cleanup may occur shortly after expiresAt rather than at the exact second.
 */
authSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("AuthSession", authSessionSchema);
