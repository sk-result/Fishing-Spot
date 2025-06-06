import jwt from "jsonwebtoken";
// Middleware untuk otentikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // isinya: { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
};

// Middleware untuk otorisasi berdasarkan role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // console.log(req.users.role)
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: role tidak diizinkan" });
    }
    next();
  };
};

const authorizeOwnerOrAdmin = (req, res, next) => {
  try {
    const userId = req.user.id;
    const paramId = parseInt(req.params.id);

    if (req.user.role === "admin" || userId === paramId) {
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
