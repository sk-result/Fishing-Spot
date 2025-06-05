import express from "express";
import Users from "../controllers/UsersController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Auth
router.post("/register", Users.Register);
router.post("/login", Users.Login);
router.post("/logout", Users.Logout);

router.get("/me", authenticateToken, Users.Profile);
router.get("/profilUserAll", Users.GetAllUser); // publik
router.get(
  "/profilAdminAll",
  authenticateToken,
  authorizeRoles("admin"),
  Users.GetAllAdmin
); // hanya admin

router.get("/:id", authenticateToken, Users.GetById);

router.put("/:id", authenticateToken, Users.Update);
router.delete("/:id", authenticateToken, Users.Delete);

export default router;
