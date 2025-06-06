import express from "express";
import ReviewController from "../controllers/ReviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Ambil semua review
router.get("/", ReviewController.getAll);

// Ambil review berdasarkan spot ID
router.get("/spot/:spotId", ReviewController.getBySpotId);

// Buat review
router.post("/", authenticateToken, ReviewController.create);

// Update review
router.put("/:id", authenticateToken, ReviewController.update);

// Hapus review
router.delete("/:id", authenticateToken, ReviewController.delete);

export default router;
