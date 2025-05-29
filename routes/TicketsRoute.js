import express from "express";
import Tickets from "../controllers/TicketsController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", authenticateToken, Tickets.create);

export default router;
