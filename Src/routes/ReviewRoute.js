import express from "express";
import ReviewController from "../controllers/ReviewController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Ambil semua review
router.get("/", ReviewController.getAll);

// Ambil review berdasarkan spot ID
router.get("/spot/:spotId", ReviewController.getBySpotId);

// Ambil review berdasarkan user ID
router.get("/user/:userId", ReviewController.getByUserId);

// Ambil rata-rata rating untuk spot tertentu
router.get("/average/:spotId", ReviewController.getAverageRating);

// Buat review (harus login)
router.post("/", authenticateToken, ReviewController.create);

// Update review (harus login & pemilik / admin)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  ReviewController.update
);

// Hapus review (harus login & pemilik / admin)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  ReviewController.delete
);

export default router;
