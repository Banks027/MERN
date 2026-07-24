const AuthSession = require("../models/AuthSession");
const {
  createAccessToken,
  createRefreshToken,
  hashToken,
  getTokenExpiration,
} = require("./tokens");

const ACCESS_COOKIE_NAME = "knightmarket_access";
const REFRESH_COOKIE_NAME = "knightmarket_refresh";

function getCookieOptions(maxAge) {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge,
    path: "/",
  };
}

function setAccessCookie(res, accessToken) {
  const expiresAt = getTokenExpiration(accessToken);

  res.cookie(
    ACCESS_COOKIE_NAME,
    accessToken,
    getCookieOptions(expiresAt.getTime() - Date.now())
  );

  return expiresAt;
}

function setRefreshCookie(res, refreshToken) {
  const expiresAt = getTokenExpiration(refreshToken);

  res.cookie(
    REFRESH_COOKIE_NAME,
    refreshToken,
    getCookieOptions(expiresAt.getTime() - Date.now())
  );

  return expiresAt;
}

async function createUserSession(user, req, res) {
  /*
   * Creating the Mongoose document first gives us a session ID
   * before it is saved to MongoDB.
   */
  const session = new AuthSession({
    user: user._id,
    refreshTokenHash: "pending",
    expiresAt: new Date(),
    userAgent: req.get("user-agent") || "",
    ipAddress: req.ip || "",
    lastUsedAt: new Date(),
  });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user, session._id);

  session.refreshTokenHash = hashToken(refreshToken);
  session.expiresAt = getTokenExpiration(refreshToken);

  await session.save();

  const accessExpiresAt = setAccessCookie(res, accessToken);
  const refreshExpiresAt = setRefreshCookie(res, refreshToken);

  return {
    session,
    accessExpiresAt,
    refreshExpiresAt,
  };
}

async function rotateUserSession(user, session, res) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user, session._id);

  session.refreshTokenHash = hashToken(refreshToken);
  session.expiresAt = getTokenExpiration(refreshToken);
  session.lastUsedAt = new Date();

  await session.save();

  const accessExpiresAt = setAccessCookie(res, accessToken);
  const refreshExpiresAt = setRefreshCookie(res, refreshToken);

  return {
    accessExpiresAt,
    refreshExpiresAt,
  };
}

function clearAuthCookies(res) {
  const isProduction = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  };

  res.clearCookie(ACCESS_COOKIE_NAME, options);
  res.clearCookie(REFRESH_COOKIE_NAME, options);
}

module.exports = {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  createUserSession,
  rotateUserSession,
  clearAuthCookies,
};