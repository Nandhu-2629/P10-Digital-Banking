function notFound(req, res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
}

function errorHandler(err, req, res, next) {
  console.error(err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errorCode = err.errorCode || "SERVER_ERROR";

  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = Object.values(err.errors).map(e => e.message).join("; ");
  }
  if (err.name === "CastError") {
    statusCode = 400;
    errorCode = "INVALID_ID";
    message = "Invalid resource ID";
  }
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = "DUPLICATE_RESOURCE";
    message = "A record with the same unique value already exists";
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorCode = "INVALID_TOKEN";
    message = "Invalid authentication token";
  }

  res.status(statusCode).json({ success: false, message, errorCode });
}

module.exports = { notFound, errorHandler };
