import express from "express";
import Payment from "../controllers/PaymentController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/pembayaran", authenticateToken, Payment.PaymentTicket);

// Admin routes:
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  Payment.getAllPayments
);
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  Payment.getPaymentById
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  Payment.deletePayment
);

export default router;
