import express from "express";
import Payment from "../controllers/PaymentController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/pembayaran" , authenticateToken, Payment.PaymentTicket)
// router.post("/b" , authenticateToken, Payment.payAndGenerateTicket)

export default router;