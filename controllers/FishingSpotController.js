import fishingModel from "../models/fishingModel.js";
import validasiSchema from "../validator/validasi_fishing_spot.js";


const FishingController = {
  getAll: async (req, res) => {
    try {
      const fishings = await fishingModel.getAll();
      res.json(fishings);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Tempat tidak ditemukan",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const fishing = await fishingModel.getById(id);
      if (!fishing)
        return res.status(404).json({ error: "Fishing spot not found" });
      res.json(fishing);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Tempat tidak ditemukan",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const image = req.file ? req.file.filename : null;
      const { error, value } = validasiSchema.validate(req.body, {
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
      const data = {
        name,
        description,
        price_per_hour: parseFloat(price_per_hour),
        image,
        status,
      };

      const newFishing = await fishingModel.create(data);
      res.status(201).json(newFishing);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal upload tempat pemancingan",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { error, value } = validasiSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      const { name, description, price_per_hour, status } = value;
      const data = {
        name,
        description,
        price_per_hour: parseFloat(price_per_hour),
        status,
      };

      if (req.file) {
        data.image = req.file.filename;
      }

      const updatedFishing = await fishingModel.update(id, data);
      res.json(updatedFishing);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Proses gagal saat merubah data tempat pemancingan",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const fishing = await fishingModel.getById(id);
      if (!fishing) {
        return res
          .status(404)
          .json({ message: "Tempat pemancingan tidak ditemukan" });
      }

      await fishingModel.delete(id);
      res.json({ message: "Tempat pemancingan berhasil dihapus" });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Gagal menghapus tempat pemancingan",
          detail: error.message,
        });
    }
  },
};

export default FishingController;
