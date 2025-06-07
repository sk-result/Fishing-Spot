import fishingModel from "../models/fishingModel.js";
import validasiSchema from "../validator/validasi_fishing_spot.js";

const FishingController = {
  getAll: async (req, res) => {
    try {
      const fishings = await fishingModel.getAll();
      if (!fishings || fishings.length === 0) {
        return res.status(404).json({
          message: "Data tidak ditemukan",
        });
      }
      res.json({
        status: "success",
        message: "Data berhasil diambil",
        data: fishings,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data tempat pemancingan",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID tidak valid" });
    }

    try {
      const fishing = await fishingModel.getById(id);
      if (!fishing)
        return res
          .status(404)
          .json({ status: "error", message: "Tempat tidak ditemukan" });

      res.json({ status: "success", data: fishing });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil tempat pemancingan",
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
        return res
          .status(400)
          .json({ status: "error", message: "Validasi gagal", errors });
      }

      if (!image || !req.file.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ status: "error", message: "File harus berupa gambar" });
      }

      if (!image) {
        return res
          .status(400)
          .json({ status: "error", message: "Gambar harus diupload" });
      }

      const data = {
        ...value,
        price_per_hour: parseFloat(value.price_per_hour),
        image,
      };

      const newFishing = await fishingModel.create(data);
      res.status(201).json({
        status: "success",
        message: "Tempat berhasil dibuat",
        data: newFishing,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal upload tempat pemancingan",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID tidak valid" });
    }

    try {
      const { error, value } = validasiSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res
          .status(400)
          .json({ status: "error", message: "Validasi gagal", errors });
      }

      const data = {
        ...value,
        price_per_hour: parseFloat(value.price_per_hour),
      };

      if (req.file && !req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ message: "File harus berupa gambar" });
      }

      if (req.file) {
        data.image = req.file.filename;
      }

      const updatedFishing = await fishingModel.update(id, data);

      if (!updatedFishing) {
        return res.status(404).json({
          status: "error",
          message: "Tempat tidak ditemukan untuk diperbarui",
        });
      }

      res.json({
        status: "success",
        message: "Tempat berhasil diperbarui",
        data: updatedFishing,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengubah tempat pemancingan",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ status: "error", message: "ID tidak valid" });
    }

    try {
      const fishing = await fishingModel.getById(id);
      if (!fishing) {
        return res
          .status(404)
          .json({ status: "error", message: "Tempat tidak ditemukan" });
      }

      await fishingModel.delete(id);

      res.status(204).send(); // atau jika tetap ingin pesan:
      res.json({ status: "success", message: "Tempat berhasil dihapus" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menghapus tempat pemancingan",
        error: error.message,
      });
    }
  },
};

export default FishingController;
