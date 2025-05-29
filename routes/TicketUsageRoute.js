import express from "express";
import TicketUsageController from "../controllers/TicketUsageController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Rute CRUD untuk penggunaan tiket
router.post("/create", TicketUsageController.create);
router.get("/", TicketUsageController.getAll);

export default router;
