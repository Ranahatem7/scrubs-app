const jwt = require("jsonwebtoken");

// Middleware — verify admin JWT on protected routes
function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }
  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    if (!payload.isAdmin) return res.status(403).json({ message: "Not admin" });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = adminAuth;