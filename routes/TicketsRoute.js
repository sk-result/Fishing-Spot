import express from "express";
import Tickets from "../controllers/TicketsController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, Tickets.GetAll);
router.get("/:id", authenticateToken, Tickets.GetById);
router.post("/create", authenticateToken, Tickets.create);
router.post("/buy", authenticateToken, Tickets.BuyTickets);
router.put("/update/:id", authenticateToken, Tickets.update);
router.delete("/delete/:id", authenticateToken, Tickets.delete);

export default router;
