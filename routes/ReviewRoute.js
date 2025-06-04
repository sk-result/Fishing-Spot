import express from "express";
import ReviewController from "../controllers/ReviewController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/all", ReviewController.getAll);
router.get("/spot/:spotId", ReviewController.getBySpotId);
router.post("/create", authenticateToken, ReviewController.create);

export default router;
