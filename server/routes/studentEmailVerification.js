const express = require("express");
const crypto = require("crypto");

const User = require("../models/User");
const requireAuth = require("../middleware/requireAuth");

const { hashToken } = require("../utils/tokens");

const {
  sendStudentVerificationEmail,
} = require("../utils/email");

const {
  normalizeEmail,
  isUcfEmail,
  markStudentVerified,
} = require("../utils/studentVerification");

const router = express.Router();

/*
 * POST /api/student-email/send-code
 *
 * Sends a six-digit verification code to a UCF email address.
 * The user must already be signed in.
 */
router.post("/send-code", requireAuth, async (req, res) => {
  try {
    const studentEmail = normalizeEmail(req.body.studentEmail);

    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "A UCF email address is required.",
      });
    }

    if (!isUcfEmail(studentEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid UCF email address.",
      });
    }

    const user = await User.findById(req.auth.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account could not be found.",
      });
    }

    if (
      user.verifiedStudent &&
      user.studentEmail === studentEmail
    ) {
      return res.status(200).json({
        success: true,
        message: "This UCF email is already verified.",
      });
    }

    const verificationCode = crypto
      .randomInt(100000, 1000000)
      .toString();

    const verificationCodeHash =
      hashToken(verificationCode);

    const verificationExpiresAt =
      new Date(Date.now() + 10 * 60 * 1000);

    user.studentEmail = studentEmail;
    user.verifiedStudent = false;
    user.studentEmailVerifiedAt = null;

    user.studentEmailVerificationTokenHash =
      verificationCodeHash;

    user.studentEmailVerificationExpiresAt =
      verificationExpiresAt;

    user.studentEmailVerificationLastSentAt =
      new Date();

    await user.save();

    await sendStudentVerificationEmail({
      to: studentEmail,
      displayName: user.displayName,
      verificationCode,
    });

    return res.status(200).json({
      success: true,
      message:
        "A verification code was sent to your UCF email.",
      verificationExpiresAt,
    });
  } catch (error) {
    console.error(
      "Student verification email error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to send the student verification code.",
    });
  }
});

/*
 * POST /api/student-email/verify-code
 *
 * Confirms the six-digit code sent to the user's UCF email.
 */
router.post("/verify-code", requireAuth, async (req, res) => {
  try {
    const verificationCode =
      typeof req.body.verificationCode === "string"
        ? req.body.verificationCode.trim()
        : "";

    if (!/^\d{6}$/.test(verificationCode)) {
      return res.status(400).json({
        success: false,
        message:
          "Verification code must contain exactly six digits.",
      });
    }

    const user = await User.findById(
      req.auth.userId
    ).select(
      "+studentEmailVerificationTokenHash"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account could not be found.",
      });
    }

    if (user.verifiedStudent) {
      return res.status(200).json({
        success: true,
        message: "Student email is already verified.",
        studentEmail: user.studentEmail,
      });
    }

    if (
      !user.studentEmail ||
      !user.studentEmailVerificationTokenHash ||
      !user.studentEmailVerificationExpiresAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No active student verification code was found.",
      });
    }

    if (
      user.studentEmailVerificationExpiresAt <=
      new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student verification code has expired. Please request a new code.",
      });
    }

    const submittedCodeHash =
      hashToken(verificationCode);

    const storedHashBuffer = Buffer.from(
      user.studentEmailVerificationTokenHash,
      "hex"
    );

    const submittedHashBuffer = Buffer.from(
      submittedCodeHash,
      "hex"
    );

    const codeMatches =
      storedHashBuffer.length ===
        submittedHashBuffer.length &&
      crypto.timingSafeEqual(
        storedHashBuffer,
        submittedHashBuffer
      );

    if (!codeMatches) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    markStudentVerified(user, user.studentEmail);

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "UCF student email verified successfully.",
      studentEmail: user.studentEmail,
      verifiedStudent: user.verifiedStudent,
    });
  } catch (error) {
    console.error(
      "Student code verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify the student email.",
    });
  }
});

/*
 * GET /api/student-email/status
 *
 * Returns the current user's student-verification status.
 */
router.get("/status", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(
      req.auth.userId
    ).select(
      "verifiedStudent studentEmail studentEmailVerifiedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account could not be found.",
      });
    }

    return res.status(200).json({
      success: true,
      verification: {
        verifiedStudent: user.verifiedStudent,
        studentEmail: user.studentEmail,
        studentEmailVerifiedAt:
          user.studentEmailVerifiedAt,
      },
    });
  } catch (error) {
    console.error(
      "Student verification status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve student verification status.",
    });
  }
});

module.exports = router;