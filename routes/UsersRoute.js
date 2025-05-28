import express from "express";
import Users from "../controllers/UsersController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", Users.Register);
router.post("/login", Users.Login);
router.post("/logout", Users.Logout);
router.get("/profil/:id", Users.GetById);
router.get("/myprofil", authenticateToken, Users.Profile);
router.get("/profilUserAll", Users.GetAllUser);

router.get(
  "/profilAdminAll",
  authenticateToken,
  authorizeRoles("admin"),
  Users.GetAllAdmin
);

router.put("/update/:id", Users.Update);
router.delete("/delete/:id", Users.Delete);

export default router;
