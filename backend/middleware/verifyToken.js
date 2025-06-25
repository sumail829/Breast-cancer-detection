import jwt from "jsonwebtoken";
import 'dotenv/config';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("📦 Received token:", token); // Log token for checking

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded); // Should contain id and role
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token error:", err.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
