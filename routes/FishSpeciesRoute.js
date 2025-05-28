
import express from "express";
import FishSpecies from "../controllers/FishSpeciesController.js";

const router = express.Router();

router.get("/", FishSpecies.getAllSpecies);
router.get("/show/:id",FishSpecies.getSpeciesById);
router.post("/create", FishSpecies.createSpecies);
router.put("/update/:id", FishSpecies.updateSpecies);
router.delete("/delete/:id", FishSpecies.deleteSpecies);

export default router;
