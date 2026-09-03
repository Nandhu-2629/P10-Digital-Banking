const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication token required", errorCode: "AUTH_REQUIRED" });
    }
    const token = header.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "User is inactive or no longer exists", errorCode: "AUTH_INVALID" });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You do not have permission to perform this action", errorCode: "FORBIDDEN" });
    }
    next();
  };
}

module.exports = { protect, authorize };
