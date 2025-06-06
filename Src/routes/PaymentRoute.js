import express from "express";
import Payment from "../controllers/PaymentController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/pembayaran", authenticateToken, Payment.PaymentTicket);

// Admin routes:
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  Payment.getAllPayments
);
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  Payment.getPaymentById
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  Payment.deletePayment
);

export default router;
