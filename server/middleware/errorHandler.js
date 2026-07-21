// Catches unmatched routes and forwards a 404 into the error handler
function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found — ${req.method} ${req.originalUrl}`));
}

// Centralized error handler — every thrown/rejected error in a route ends up here
function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  let message = err.message || "Server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose duplicate key (e.g. email or slug already exists)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already in use` : "Duplicate value";
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
