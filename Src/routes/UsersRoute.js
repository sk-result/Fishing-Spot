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

router.patch("/", authenticateToken, authorizeOwnerOrAdmin, Users.UpdateMe);
// router.delete("/:id", authenticateToken, authorizeOwnerOrAdmin, Users.DeleteMe);

// List user umum
router.get("/profilUserAll", authenticateToken, Users.GetAllUser); // public w/ pagination
router.get("/profilUserById/:id", authenticateToken, Users.GetById);

// List admin-only
router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("super_admin"),
  Users.GetAllAdmin
);

// Admin only create user dengan role dan update user dengan role
router.post(
  "/admin",
  authenticateToken,
  authorizeRoles("super_admin"),
  Users.AdminCreateUser
);
router.put(
  "/admin/:id",
  authenticateToken,
  authorizeRoles("super_admin"),
  Users.Update
);
router.delete(
  "/admin/:id",
  authenticateToken,
  authorizeRoles("super_admin"),
  authorizeOwnerOrAdmin,
  Users.DeleteById
);
export default router;
