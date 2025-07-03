const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log("Auth Header:", req.headers.authorization); // Add this line

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message); // Add this line
    res.status(400).json({ message: "Invalid token" });
  }
};
