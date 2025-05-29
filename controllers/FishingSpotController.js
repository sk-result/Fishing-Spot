// controllers/FishingController.js
import prisma from "../models/prismaClient.js";
import validasiSchema from "../validator/validasi_fishing_spot.js";

const FishingController = {
  // Get all fishing spots
  getAll: async (req, res, next) => {
    try {
      const fishings = await prisma.fishing.findMany();
      res.json(fishings);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Tempat tidak ditemukan",
        error: error.message,
      });
    }
  },

  // Get fishing by ID
  getById: async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      const fishing = await prisma.fishing.findUnique({ where: { id } });
      if (!fishing) return res.status(404).json({ error: "Fishing not found" });
      res.json(fishing);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Tempat tidak ditemukan",
        error: error.message,
      });
    }
  },

  // Create a new fishing spot
  create: async (req, res, next) => {
    try {
      const image = req.file ? req.file.filename : null;
      const body = req.body;

      const { error, value } = validasiSchema.validate(body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      if (!image) {
        return res.status(400).json({ message: "Gambar harus diupload" });
      }

      const { name, description, price_per_hour, status } = value;

      const newFishing = await prisma.fishing.create({
        data: {
          name,
          description,
          price_per_hour: parseFloat(price_per_hour),
          image,
          status,
        },
      });

      res.status(201).json(newFishing);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal upload tempat pemancingan",
        error: error.message,
      });
    }
  },

  // Update fishing spot
  update: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const image = req.file ? req.file.filename : null;
      const body = req.body;
      const { error, value } = validasiSchema.validate(body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }
      const { name, description, price_per_hour, status } = value;

      const updatedFishing = await prisma.fishing.update({
        where: { id },
        data: {
          name,
          description,
          price_per_hour: parseFloat(price_per_hour),
          image,
          status,
        },
      });
      res.json(updatedFishing);
    } catch (error) {
      res.status(422).json({
        status: "error",
        message: "Proses gagal saat merubah data tempat pemancingan",
      });
    }
  },

  // Delete fishing spot
  delete: async (req, res, next) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.fishing.delete({ where: { id } });
      res.json({ message: "Tempat pemancingan berhasil di hapus" });
    } catch (error) {
      res.status(404).json({ error: "Gagal menghapus tempat pemancingan" });
    }
  },
};

export default FishingController;
