// controllers/TicketsController.js
import ticketsModel from "../models/ticketsModel.js";
import validasiSchema from "../validator/validasi_tickets.js";

const TicketsController = {
  getAll: async (req, res) => {
    try {
      const tickets = await ticketsModel.getAll();
      res.json({ status: "success", data: tickets });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data tiket",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res
          .status(400)
          .json({ status: "error", message: "ID tiket tidak valid" });

      const ticket = await ticketsModel.getById(id);
      if (!ticket) {
        return res
          .status(404)
          .json({ status: "error", message: "Tiket tidak ditemukan" });
      }

      res.status(200).json({ status: "success", data: ticket });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil tiket",
        error: error.message,
      });
    }
  },

  getByUserId: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }
      const tickets = await ticketsModel.getByUserId(userId);
      res.status(200).json({ status: "success", data: tickets });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil tiket user",
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

      const userId = req.user?.id;
      const username = req.user?.username;
      if (!userId) {
        return res
          .status(401)
          .json({
            status: "error",
            message: "Unauthorized, token tidak valid",
          });
      }

      const fishingSpot = await ticketsModel.getFishingSpotById(
        value.fishing_spot_id
      );
      if (!fishingSpot) {
        return res
          .status(404)
          .json({ status: "error", message: "Spot memancing tidak ditemukan" });
      }

      const pricePerHour = Number(fishingSpot.price_per_hour);
      const duration = value.duration_minutes || 60;
      const totalPrice = (pricePerHour * duration) / 60;

      const ticket_code = `T-${Date.now().toString().slice(-4)}${Math.floor(
        Math.random() * 100
      )}`;
      const valid_date = new Date();
      valid_date.setDate(valid_date.getDate() + 3);

      const data = {
        ticket_code,
        fishing_spot_id: value.fishing_spot_id,
        valid_date,
        status: "unused",
        status_pembayaran: "unpaid",
        duration_minutes: duration,
        user_id: userId,
        created_at: new Date(),
      };

      const newTicket = await ticketsModel.create(data);

      res.status(201).json({
        status: "success",
        message: "Tiket berhasil dibuat",
        data: {
          code: newTicket.ticket_code,
          name: username,
          payment_expired: newTicket.valid_date,
          status: newTicket.status,
          status_pembayaran: newTicket.status_pembayaran,
          amount: totalPrice,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal membuat tiket",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res
          .status(400)
          .json({ status: "error", message: "ID tiket tidak valid" });

      const { error, value } = validasiSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res
          .status(400)
          .json({ status: "error", message: "Validasi gagal", errors });
      }

      const fishingSpot = await ticketsModel.getFishingSpotById(
        value.fishing_spot_id
      );
      if (!fishingSpot) {
        return res
          .status(404)
          .json({ status: "error", message: "Spot memancing tidak ditemukan" });
      }

      const data = {
        fishing_spot_id: value.fishing_spot_id,
        duration_minutes: value.duration_minutes || 60,
        // Jangan ubah status dan created_at otomatis saat update
        updated_at: new Date(),
      };

      const updatedTicket = await ticketsModel.update(id, data);

      res.status(200).json({
        status: "success",
        message: "Tiket berhasil diperbarui",
        data: updatedTicket,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui tiket",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res
          .status(400)
          .json({ status: "error", message: "ID tiket tidak valid" });

      const existing = await ticketsModel.getById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ status: "error", message: "Tiket tidak ditemukan." });
      }

      await ticketsModel.delete(id);
      res
        .status(200)
        .json({ status: "success", message: "Tiket telah dihapus" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menghapus tiket.",
        error: error.message,
      });
    }
  },

  cetakTicket: async (req, res) => {
    try {
      const { ticket_code } = req.body;
      const userId = req.user?.id;
      const username = req.user?.username;

      if (!userId) {
        return res
          .status(401)
          .json({
            status: "error",
            message: "Unauthorized, token tidak valid",
          });
      }

      if (!ticket_code) {
        return res
          .status(400)
          .json({ status: "error", message: "Kode tiket wajib diisi" });
      }

      const result = await ticketsModel.cetakTicketByCode(ticket_code, userId);

      if (!result) {
        return res
          .status(404)
          .json({
            status: "error",
            message: "Tiket tidak ditemukan atau bukan milik Anda",
          });
      }

      if (result === "unpaid") {
        return res
          .status(403)
          .json({
            status: "error",
            message: "Tiket belum dibayar, tidak bisa dicetak",
          });
      }

      res.status(200).json({
        status: "success",
        message: "Tiket berhasil dicetak",
        data: {
          code: result.ticket_code,
          name: username,
          valid_until: result.valid_date,
          status: result.status,
          duration: result.duration_minutes,
          spot: result.fishing_spot?.name,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan saat mencetak tiket",
        error: error.message,
      });
    }
  },
};

export default TicketsController;
