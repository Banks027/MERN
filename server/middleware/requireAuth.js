const { verifyAccessToken } = require("../utils/tokens");
const { ACCESS_COOKIE_NAME } = require("../utils/session");

function requireAuth(req, res, next) {
  const accessToken = req.cookies?.[ACCESS_COOKIE_NAME];

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required.",
    });
  }

  try {
    const payload = verifyAccessToken(accessToken);

    if (payload.type !== "access" || !payload.sub) {
      throw new Error("Invalid access-token payload.");
    }

    req.auth = {
      userId: payload.sub,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session has expired.",
    });
  }
}

module.exports = requireAuth;
