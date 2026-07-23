const express = require("express");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const AuthSession = require("../models/AuthSession");

const requireAuth = require("../middleware/requireAuth");

const {
  verifyRefreshToken,
  hashToken,
} = require("../utils/tokens");

const {
  REFRESH_COOKIE_NAME,
  createUserSession,
  rotateUserSession,
  clearAuthCookies,
} = require("../utils/session");

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/*
 * POST /auth/google
 *
 * Receives a Google ID credential from React, verifies it,
 * creates or updates the user, and starts a KnightMarket session.
 */
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is missing from the environment.");

      return res.status(500).json({
        success: false,
        message: "Google authentication is not configured.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Google credential could not be verified.",
      });
    }

    const {
      sub: googleId,
      email,
      email_verified: emailVerified,
      name: displayName,
      picture: profilePicture,
    } = payload;

    if (!googleId || !email || !emailVerified) {
      return res.status(401).json({
        success: false,
        message: "A verified Google email account is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      $or: [{ googleId }, { email: normalizedEmail }],
    });

    let isNewUser = false;

    if (user) {
      /*
       * Do not link this email to a different Google account
       * when a Google ID is already stored.
       */
      if (user.googleId && user.googleId !== googleId) {
        return res.status(409).json({
          success: false,
          message: "This email is already linked to another Google account.",
        });
      }

      user.googleId = googleId;
      user.displayName = displayName || user.displayName;
      user.profilePicture = profilePicture || user.profilePicture;
      user.lastLoginAt = new Date();

      if (!user.authProviders.includes("google")) {
        user.authProviders.push("google");
      }

      if (!user.emailVerified) {
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
      }

      await user.save();
    } else {
      isNewUser = true;

      user = await User.create({
        googleId,
        email: normalizedEmail,
        displayName: displayName || normalizedEmail,
        profilePicture: profilePicture || "",
        authProviders: ["google"],
        emailVerified: true,
        emailVerifiedAt: new Date(),
        lastLoginAt: new Date(),
      });
    }

    /*
     * Creates the access and refresh JWTs, stores the hashed
     * refresh token in MongoDB, and sets the HttpOnly cookies.
     */
    const sessionInfo = await createUserSession(user, req, res);

    return res.status(isNewUser ? 201 : 200).json({
      success: true,
      isNewUser,
      message: isNewUser
        ? "Google account created successfully."
        : "Google sign-in successful.",
      session: {
        accessExpiresAt: sessionInfo.accessExpiresAt,
        refreshExpiresAt: sessionInfo.refreshExpiresAt,
      },
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Google authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Google credential.",
    });
  }
});

/*
 * POST /auth/refresh
 *
 * Uses the long-lived refresh-token cookie to issue a fresh
 * access token and rotate the refresh token.
 */
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      message: "Refresh token is missing.",
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    if (
      payload.type !== "refresh" ||
      !payload.sub ||
      !payload.sid
    ) {
      throw new Error("Invalid refresh-token payload.");
    }

    /*
     * refreshTokenHash uses select: false in the schema,
     * so it must be explicitly selected here.
     */
    const session = await AuthSession.findById(payload.sid)
      .select("+refreshTokenHash");

    if (!session) {
      throw new Error("Session could not be found.");
    }

    if (session.revokedAt) {
      throw new Error("Session has been revoked.");
    }

    if (session.expiresAt <= new Date()) {
      throw new Error("Session has expired.");
    }

    if (session.user.toString() !== payload.sub) {
      throw new Error("Session does not belong to this user.");
    }

    const providedTokenHash = hashToken(refreshToken);

    if (session.refreshTokenHash !== providedTokenHash) {
      /*
       * A mismatch may indicate that an older token was reused
       * after refresh-token rotation.
       */
      session.revokedAt = new Date();
      await session.save();

      throw new Error("Refresh token does not match.");
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      session.revokedAt = new Date();
      await session.save();

      throw new Error("User account no longer exists.");
    }

    const sessionInfo = await rotateUserSession(
      user,
      session,
      res
    );

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully.",
      session: {
        accessExpiresAt: sessionInfo.accessExpiresAt,
        refreshExpiresAt: sessionInfo.refreshExpiresAt,
      },
    });
  } catch (error) {
    console.error("Session refresh error:", error.message);

    clearAuthCookies(res);

    return res.status(401).json({
      success: false,
      message: "Your session could not be refreshed.",
    });
  }
});

/*
 * POST /auth/logout
 *
 * Revokes the current refresh session in MongoDB and clears
 * both authentication cookies.
 */
router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);

      if (payload.sid) {
        await AuthSession.findByIdAndUpdate(payload.sid, {
          revokedAt: new Date(),
        });
      }
    } catch (error) {
      /*
       * Logout should still succeed when the token is expired,
       * malformed, missing from MongoDB, or already revoked.
       */
    }
  }

  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

/*
 * GET /auth/me
 *
 * Verifies the short-lived access-token cookie and returns
 * the currently authenticated user.
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId);

    if (!user) {
      clearAuthCookies(res);

      return res.status(401).json({
        success: false,
        message: "User account could not be found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Current-user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve the current user.",
    });
  }
});

/*
 * Keeps the user JSON consistent between /google and /me.
 * Sensitive values such as passwordHash are never included.
 */
function formatUserResponse(user) {
  return {
    id: user._id,
    email: user.email,
    displayName: user.displayName,
    profilePicture: user.profilePicture,
    authProviders: user.authProviders,
    emailVerified: user.emailVerified,
    passwordCreated: Boolean(user.passwordSetAt),
    verifiedStudent: user.verifiedStudent,
    university: user.university,
  };
}

module.exports = router;