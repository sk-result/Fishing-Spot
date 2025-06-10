import express from "express";
import TicketsController from "../controllers/TicketsController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  TicketsController.getAll
);
router.get("/me", authenticateToken, TicketsController.getMyTickets);
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "super_admin"),
  TicketsController.getById
);
router.post("/", authenticateToken, TicketsController.create);
router.put("/:id", authenticateToken, TicketsController.update);
router.delete("/:id", authenticateToken, TicketsController.delete);
router.post("/print", authenticateToken, TicketsController.cetakTicket);

export default router;
