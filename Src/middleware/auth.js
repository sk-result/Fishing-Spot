import jwt from "jsonwebtoken";

// Middleware untuk otentikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Format token tidak valid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // isinya: { id, role, iat, exp }
    next();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

// Middleware untuk otorisasi berdasarkan role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Akses ditolak: user tidak ditemukan" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Akses ditolak: role '${req.user.role}' tidak diizinkan`,
      });
    }

    next();
  };
};

// Middleware untuk authorize owner atau admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  try {
    const userId = req.user.id;
    const paramId = parseInt(req.params.id);

    if (
      req.user.role === "super_admin" ||
      req.user.role === "admin" ||
      userId === paramId
    ) {
      return next();
    }

    return res.status(403).json({ message: "Akses ditolak" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export { authenticateToken, authorizeRoles, authorizeOwnerOrAdmin };
