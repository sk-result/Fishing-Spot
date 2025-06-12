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
      const { error, value } = validasiSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res
          .status(400)
          .json({ status: "error", message: "Validasi gagal", errors });
      }

      if (!req.file || !req.file.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ status: "error", message: "File harus berupa gambar" });
      }
      const userId = req.user?.id;
      const username = req.user?.username;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized: userId tidak ditemukan",
        });
      }
      const image = req.file.filename;

      const data = {
        ...value,
        price_per_hour: parseFloat(value.price_per_hour),
        image,
        userId,
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

    // Validasi data kosong
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Mohon isi data terlebih dahulu",
      });
    }

    try {
      // Cek apakah tempatnya ada
      const existingFishing = await fishingModel.getById(id);
      if (!existingFishing) {
        return res.status(404).json({
          status: "error",
          message: "Tempat pemancingan tidak ditemukan",
        });
      }

      if (existingFishing.userId !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki izin untuk memperbarui tempat ini",
        });
      }

      // Validasi skema
      const { error, value } = validasiSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({
          status: "error",
          message: "Validasi gagal",
          errors,
        });
      }

      // Validasi file gambar
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "Gambar wajib diunggah saat memperbarui data",
        });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          status: "error",
          message: "File harus berupa gambar",
        });
      }

      const data = {
        ...value,
        price_per_hour: parseFloat(value.price_per_hour),
        image: req.file.filename,
      };

      const updatedFishing = await fishingModel.update(id, data);

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
      if (fishing.userId !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Anda tidak memiliki izin untuk menghapus tempat ini",
        });
      }

      await fishingModel.delete(id);

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
