// controllers/FishSpecies.js
import prisma from "../models/prismaClient.js";
import validasiSchema from "../validator/validasi.js";

const FishSpecies = {
  getAllSpecies: async (req, res) => {
    try {
      const species = await prisma.specie.findMany();
      res.json(species);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },

  getSpeciesById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const species = await prisma.specie.findUnique({ where: { id } });
      if (!species) {
        return res.status(404).json({ error: "Data spesies tidak ditemukan" });
      }
      res.json(species);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },

  createSpecies: async (req, res) => {
    try {
      const body = req.body;
      const { error } = validasiSchema.validate(body, { abortEarly: false });
      if (error) {
        return res.status(422).json({ error: error.details });
      }

      const newSpecies = await prisma.specie.create({
        data: { ...body },
      });
      res.status(201).json(newSpecies);
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
  },

  updateSpecies: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const body = req.body;
      const { error } = validasiSchema.validate(body, { abortEarly: false });
      if (error) {
        return res.status(422).json({ error: error.details });
      }

      const updatedSpecies = await prisma.specie.update({
        where: { id },
        data: { ...body },
      });
      res.json(updatedSpecies);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },

  deleteSpecies: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.specie.delete({ where: { id } });
      res.json({ message: "Data spesies berhasil dihapus" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
};

export default FishSpecies;
