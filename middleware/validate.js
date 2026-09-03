const { validationResult } = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Request validation failed");
    err.statusCode = 400;
    err.errorCode = "VALIDATION_ERROR";
    err.details = errors.array();
    return res.status(400).json({
      success: false,
      message: "Request validation failed",
      errorCode: "VALIDATION_ERROR",
      details: errors.array()
    });
  }
  next();
}

module.exports = validate;
