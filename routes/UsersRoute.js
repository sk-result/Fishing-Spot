
import express from "express";
import Users from "../controllers/UsersController.js";


const router = express.Router();

router.post("/register", Users.Register);
router.post("/login",Users.Login);
router.post("/logout", Users.Logout);
router.get("/profil/:id", Users.GetById);
router.get("/profilAll", Users.GetAll);
router.put("/update/:id", Users.Update);

export default router;
