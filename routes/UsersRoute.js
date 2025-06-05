import express from "express";
import Users from "../controllers/UsersController.js";
import {
  authenticateToken,
  authorizeRoles,
  authorizeOwnerOrAdmin,
} from "../middleware/auth.js";

const router = express.Router();
// Auth
router.post("/register", Users.Register);
router.post("/login", Users.Login);
router.post("/logout", Users.Logout);

// Profil pribadi
router.get("/me", authenticateToken, Users.Profile);

// List user umum
router.get("/profilUserAll", Users.GetAllUser); // public w/ pagination

// List admin-only
router.get(
  "/profilAdminAll",
  authenticateToken,
  authorizeRoles("admin"),
  Users.GetAllAdmin
);

// Admin only create user dengan role dan update user dengan role
router.post(
  "/admin/create-user",
  authenticateToken,
  authorizeRoles("admin"),
  Users.AdminCreateUser
);
router.put("/:id", authenticateToken, authorizeRoles("admin"), Users.Update);

// Akses user by ID (admin atau owner)
router.get("/:id", authenticateToken, authorizeOwnerOrAdmin, Users.GetById);
router.patch(
  "/:id",
  authenticateToken,
  authorizeOwnerOrAdmin,
  Users.PartialUpdate
);
router.delete("/:id", authenticateToken, authorizeOwnerOrAdmin, Users.Delete);

export default router;
