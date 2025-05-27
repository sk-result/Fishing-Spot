
import express from "express";
import Users from "../controllers/UsersController.js";


const router = express.Router();

router.post("/", Users.Register);
// router.get("/show/:id",Users.getSpeciesById);
// router.post("/create", Users.createSpecies);
// router.put("/update/:id", Users.updateSpecies);
// router.delete("/delete/:id", Users.deleteSpecies);

export default router;
