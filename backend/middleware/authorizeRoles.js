export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("🔐 Allowed roles:", allowedRoles);
    console.log("🧑‍💻 User role from token:", req.user?.role);

    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };
};
