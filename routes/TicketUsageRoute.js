import express from "express";
import TicketUsageController from "../controllers/TicketUsageController.js";

const router = express.Router();

// Rute CRUD untuk penggunaan tiket
router.get("/", TicketUsageController.getAll);
router.get("/:id", TicketUsageController.getById);
router.post("/tiket", TicketUsageController.create);
router.put("/:id", TicketUsageController.update);
router.delete("/:id", TicketUsageController.delete);

export default router;
