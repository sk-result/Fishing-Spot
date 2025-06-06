import express from "express";
import TicketUsageController from "../controllers/TicketUsageController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Penggunaan tiket oleh user (pakai tiket)
router.post("/", authenticateToken, TicketUsageController.useTicket);

// Admin-only routes untuk kelola penggunaan tiket
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  TicketUsageController.getAll
);
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  TicketUsageController.getById
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  TicketUsageController.delete
);

export default router;
