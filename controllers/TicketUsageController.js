import prisma from "../models/prismaClient.js";
import { TicketUsageSchema, TicketUsageSchema } from "../validator/validasi_usage.js";


const TicketUsageController = {
  getAll: async (req, res) => {
    try {
      const speciesList = await prisma.fish_species.findMany();
      res.json(speciesList);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data spesies ikan",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "ID tidak valid" });
    }
    try {
      const species = await prisma.fish_species.findUnique({ where: { id } });
      if (!species) {
        return res.status(404).json({ status: "fail", message: "Spesies ikan tidak ditemukan" });
      }
      res.json(species);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil detail spesies ikan",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const validatedData = await TicketUsageSchema.validateAsync(req.body, { abortEarly: false });
      const newSpecies = await prisma.fish_species.create({ data: validatedData });
      res.status(201).json(newSpecies);
    } catch (error) {
      if (error.isJoi) {
        return res.status(400).json({
          status: "fail",
          message: "Validasi gagal",
          errors: error.details.map((e) => e.message),
        });
      }
      res.status(500).json({
        status: "error",
        message: "Gagal menambahkan spesies ikan",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "ID tidak valid" });
    }
    try {
      const validatedData = await TicketUsageSchema.validateAsync(req.body, { abortEarly: false });
      const updatedSpecies = await prisma.fish_species.update({
        where: { id },
        data: validatedData,
      });
      res.json(updatedSpecies);
    } catch (error) {
      if (error.isJoi) {
        return res.status(400).json({
          status: "fail",
          message: "Validasi gagal",
          errors: error.details.map((e) => e.message),
        });
      }
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui spesies ikan",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "ID tidak valid" });
    }
    try {
      await prisma.fish_species.delete({ where: { id } });
      res.json({ message: "Spesies ikan berhasil dihapus" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menghapus spesies ikan",
        error: error.message,
      });
    }
  },
};

export default TicketUsageController;
