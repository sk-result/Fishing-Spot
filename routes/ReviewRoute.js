import express from "express";
import ReviewController from "../controllers/ReviewController.js";

const router = express.Router();

router.get("/all", ReviewController.getAll);
router.get("/spot/:spotId", ReviewController.getBySpotId);
router.post("/create", ReviewController.create); 

export default router;
