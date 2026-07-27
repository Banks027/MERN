const UCF_EMAIL_DOMAIN = "ucf.edu";

function normalizeEmail(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function isUcfEmail(value) {
  const email = normalizeEmail(value);
  const atIndex = email.lastIndexOf("@");

  if (atIndex <= 0) {
    return false;
  }

  return email.slice(atIndex + 1) === UCF_EMAIL_DOMAIN;
}

function markStudentVerified(user, studentEmail) {
  const normalizedStudentEmail = normalizeEmail(studentEmail);

  user.studentEmail = normalizedStudentEmail;
  user.verifiedStudent = true;
  user.studentEmailVerifiedAt = new Date();

  user.studentEmailVerificationTokenHash = null;
  user.studentEmailVerificationExpiresAt = null;
  user.studentEmailVerificationLastSentAt = null;
}

module.exports = {
  normalizeEmail,
  isUcfEmail,
  markStudentVerified,
};