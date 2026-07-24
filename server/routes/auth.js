const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
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

const {
  sendVerificationEmail,
} = require("../utils/email");

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/*
 * POST /auth/register
 *
 * Creates a local email/password account.
 * The account remains unverified until the user confirms
 * the six-digit email-verification code.
 */
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    const normalizedFirstName =
      typeof firstName === "string"
        ? firstName.trim()
        : "";

    const normalizedLastName =
      typeof lastName === "string"
        ? lastName.trim()
        : "";

    const normalizedEmail =
      typeof email === "string"
        ? email.toLowerCase().trim()
        : "";

    if (
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email, and password are required.",
      });
    }

    if (normalizedFirstName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "First name cannot exceed 50 characters.",
      });
    }

    if (normalizedLastName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Last name cannot exceed 50 characters.",
      });
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password cannot exceed 128 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    /*
     * Generate a cryptographically secure six-digit code.
     *
     * randomInt's upper boundary is exclusive, so this produces
     * values from 100000 through 999999.
     */
    const verificationCode = crypto
      .randomInt(100000, 1000000)
      .toString();

    const verificationCodeHash =
      hashToken(verificationCode);

    const verificationExpiresAt =
      new Date(Date.now() + 10 * 60 * 1000);

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const displayName =
      `${normalizedFirstName} ${normalizedLastName}`;

    const user = await User.create({
      email: normalizedEmail,
      displayName,
      passwordHash,
      authProviders: ["local"],

      emailVerified: false,
      emailVerifiedAt: null,

      emailVerificationTokenHash:
        verificationCodeHash,

      emailVerificationExpiresAt:
        verificationExpiresAt,

      passwordSetAt: new Date(),
      verifiedStudent: false,
    });
    
    await sendVerificationEmail({
      to: normalizedEmail,
      displayName,
      verificationCode,
    });
    
    /*
     * Phase 2 will send verificationCode through the email
     * provider. Do not return or log the raw code in production.
     */
    return res.status(201).json({
      success: true,
      message:
        "Account created. Please verify your email address.",
      verificationExpiresAt,
      user: formatUserResponse(user),
    });
  } catch (error) {
    /*
     * This catches a duplicate-email race condition in which
     * two requests pass findOne() before one is saved.
     */
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create the account.",
    });
  }
});

/*
 * POST /auth/verify-email
 *
 * Verifies the six-digit code sent to a local user's email.
 */
router.post("/verify-email", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const normalizedEmail =
      typeof email === "string"
        ? email.toLowerCase().trim()
        : "";

    const normalizedCode =
      typeof verificationCode === "string"
        ? verificationCode.trim()
        : "";

    if (!normalizedEmail || !normalizedCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      return res.status(400).json({
        success: false,
        message: "Verification code must contain exactly six digits.",
      });
    }

    /*
     * emailVerificationTokenHash uses select: false,
     * so it must be explicitly requested.
     */
    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+emailVerificationTokenHash +emailVerificationExpiresAt"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or verification code.",
      });
    }

    if (user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email address is already verified.",
        user: formatUserResponse(user),
      });
    }

    if (
      !user.emailVerificationTokenHash ||
      !user.emailVerificationExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No active verification code was found. Please request a new code.",
      });
    }

    if (user.emailVerificationExpiresAt <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired. Please request a new code.",
      });
    }

    const submittedCodeHash = hashToken(normalizedCode);

    const storedHashBuffer = Buffer.from(
      user.emailVerificationTokenHash,
      "hex"
    );

    const submittedHashBuffer = Buffer.from(
      submittedCodeHash,
      "hex"
    );

    const codeMatches =
      storedHashBuffer.length === submittedHashBuffer.length &&
      crypto.timingSafeEqual(
        storedHashBuffer,
        submittedHashBuffer
      );

    if (!codeMatches) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or verification code.",
      });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();

    /*
     * The code cannot be reused after successful verification.
     */
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify the email address.",
    });
  }
});

/*
 * POST /auth/login
 *
 * Authenticates a local email/password account and starts
 * a KnightMarket session.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail =
      typeof email === "string"
        ? email.toLowerCase().trim()
        : "";

    if (
      !normalizedEmail ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    /*
     * passwordHash uses select: false in the User schema,
     * so it must be explicitly included in this query.
     */
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+passwordHash");

    /*
     * Use the same response for an unknown email and an
     * incorrect password so the endpoint does not reveal
     * which email addresses are registered.
     */
    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /*
     * Local accounts must verify their email before signing in.
     */
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message:
          "Please verify your email address before signing in.",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    /*
     * Creates access and refresh JWTs, stores the hashed
     * refresh token, and sets the HttpOnly cookies.
     */
    const sessionInfo = await createUserSession(
      user,
      req,
      res
    );

    return res.status(200).json({
      success: true,
      message: "Sign-in successful.",
      session: {
        accessExpiresAt: sessionInfo.accessExpiresAt,
        refreshExpiresAt: sessionInfo.refreshExpiresAt,
      },
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Local login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in.",
    });
  }
});

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