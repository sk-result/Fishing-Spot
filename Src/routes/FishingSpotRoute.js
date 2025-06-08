import express from "express";
import multer from "multer";
import Fishing from "../controllers/FishingSpotController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// GET semua spot
router.get("/", Fishing.getAll);

// GET by ID
router.get("/:id", Fishing.getById);

// POST (dengan validasi + gambar) — hanya admin
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  upload.single("image"),
  Fishing.create
);

// PUT update (gambar opsional) — hanya admin
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  upload.single("image"),
  Fishing.update
);

// DELETE — hanya admin
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  Fishing.delete
);

export default router;
