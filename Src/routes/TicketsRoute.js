import express from "express";
import TicketsController from "../controllers/TicketsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, TicketsController.getAll);
router.get("/user", authenticateToken, TicketsController.getByUserId);
router.get("/:id", authenticateToken, TicketsController.getById);
router.post("/", authenticateToken, TicketsController.create);
router.put("/:id", authenticateToken, TicketsController.update);
router.delete("/:id", authenticateToken, TicketsController.delete);
router.post("/print", authenticateToken, TicketsController.cetakTicket);

export default router;
