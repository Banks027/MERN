const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function validateTokenConfiguration() {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is missing.");
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is missing.");
  }
}

function createAccessToken(user) {
  validateTokenConfiguration();

  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
      issuer: "knightmarket",
      audience: "knightmarket-api",
    }
  );
}

function createRefreshToken(user, sessionId) {
  validateTokenConfiguration();

  return jwt.sign(
    {
      sub: user._id.toString(),
      sid: sessionId.toString(),
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
      issuer: "knightmarket",
      audience: "knightmarket-refresh",
    }
  );
}

function verifyAccessToken(token) {
  validateTokenConfiguration();

  return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    issuer: "knightmarket",
    audience: "knightmarket-api",
  });
}

function verifyRefreshToken(token) {
  validateTokenConfiguration();

  return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: "knightmarket",
    audience: "knightmarket-refresh",
  });
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function getTokenExpiration(token) {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === "string" || !decoded.exp) {
    throw new Error("Token does not contain a valid expiration time.");
  }

  return new Date(decoded.exp * 1000);
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  getTokenExpiration,
};
