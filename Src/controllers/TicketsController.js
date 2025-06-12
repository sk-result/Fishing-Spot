// controllers/TicketsController.js
import ticketsModel from "../models/ticketsModel.js";
import validasiSchema from "../validator/validasi_tickets.js";

const formatSuccess = (message, data) => ({
  status: "success",
  message,
  data,
});

const formatError = (message, error = null, errors = null) => ({
  status: "error",
  message,
  data: null,
  ...(error && { error }),
  ...(errors && { errors }),
});

const TicketsController = {
  getAll: async (req, res) => {
    try {
      const tickets = await ticketsModel.getAll();

      if (!tickets || tickets.length === 0) {
        return res
          .status(200)
          .json(formatSuccess("Tidak ada tiket tersedia", []));
      }

      res
        .status(200)
        .json(formatSuccess("Berhasil mengambil semua tiket", tickets));
    } catch (error) {
      res
        .status(500)
        .json(formatError("Gagal mengambil data tiket", error.message));
    }
  },

  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json(formatError("ID tiket tidak valid"));
      }

      const ticket = await ticketsModel.getById(id);
      if (!ticket) {
        return res.status(404).json(formatError("Tiket tidak ditemukan"));
      }

      res.status(200).json(formatSuccess("Tiket ditemukan", ticket));
    } catch (error) {
      res.status(500).json(formatError("Gagal mengambil tiket", error.message));
    }
  },

  getMyTickets: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json(formatError("Unauthorized"));
      }

      const tickets = await ticketsModel.getByUserId(userId);
      res
        .status(200)
        .json(formatSuccess("Berhasil mengambil tiket pengguna", tickets));
    } catch (error) {
      res
        .status(500)
        .json(formatError("Gagal mengambil tiket user", error.message));
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
          .json(formatError("Validasi gagal", null, errors));
      }

      const userId = req.user?.id;
      const username = req.user?.username;
      if (!userId)
        return res
          .status(401)
          .json(formatError("Unauthorized, token tidak valid"));

      const fishingSpot = await ticketsModel.getFishingSpotById(
        value.fishing_spot_id
      );
      if (!fishingSpot)
        return res
          .status(404)
          .json(formatError("Spot memancing tidak ditemukan"));

      const ticket_code = `T-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;
      const valid_date = new Date();
      valid_date.setDate(valid_date.getDate() + 3);

      const pricePerHour = Number(fishingSpot.price_per_hour);
      const duration = value.duration_minutes;
      const totalPrice = (pricePerHour * duration) / 60;

      const data = {
        ticket_code,
        fishing_spot_id: value.fishing_spot_id,
        valid_date,
        status: "unused",
        status_pembayaran: "unpaid",
        duration_minutes: duration,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newTicket = await ticketsModel.create(data);
      res.status(201).json(
        formatSuccess("Tiket berhasil dibuat", {
          id: newTicket.id,
          code: newTicket.ticket_code,
          name: username,
          spot: fishingSpot.name,
          payment_expired: newTicket.valid_date,
          status_ticket: newTicket.status,
          status_pembayaran: newTicket.status_pembayaran,
          duration_minutes: duration,
          amount: totalPrice,
        })
      );
    } catch (error) {
      res.status(500).json(formatError("Gagal membuat tiket", error.message));
    }
  },

  // update: async (req, res) => {
  //   try {
  //     const id = parseInt(req.params.id, 10);
  //     if (!Number.isInteger(id)) {
  //       return res.status(400).json(formatError("ID tiket tidak valid"));
  //     }

  //     const { error, value } = validasiSchema.validate(req.body, {
  //       abortEarly: false,
  //     });
  //     if (error) {
  //       const errors = error.details.map((detail) => detail.message);
  //       return res
  //         .status(400)
  //         .json(formatError("Validasi gagal", null, errors));
  //     }

  //     // Cek apakah tiket ada
  //     const existingTicket = await ticketsModel.getById(id);
  //     if (!existingTicket) {
  //       return res.status(404).json(formatError("Tiket tidak ditemukan"));
  //     }

  //     // Cek kepemilikan tiket (opsional, jika sistem hanya mengizinkan pemilik)
  //     const userId = req.user?.id;
  //     if (existingTicket.user_id !== userId) {
  //       return res
  //         .status(403)
  //         .json(formatError("Akses ditolak, bukan pemilik tiket"));
  //     }

  //     // Cek apakah fishing spot valid
  //     const fishingSpot = await ticketsModel.getFishingSpotById(
  //       value.fishing_spot_id
  //     );
  //     if (!fishingSpot) {
  //       return res
  //         .status(404)
  //         .json(formatError("Spot memancing tidak ditemukan"));
  //     }

  //     const data = {
  //       fishing_spot_id: value.fishing_spot_id,
  //       duration_minutes: value.duration_minutes,
  //       updated_at: new Date(),
  //     };

  //     const updatedTicket = await ticketsModel.update(id, data);

  //     res
  //       .status(200)
  //       .json(formatSuccess("Tiket berhasil diperbarui", updatedTicket));
  //   } catch (error) {
  //     console.error(error); // Untuk debugging
  //     res
  //       .status(500)
  //       .json(formatError("Gagal memperbarui tiket", error.message));
  //   }
  // },

  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json(formatError("ID tiket tidak valid"));

      const existing = await ticketsModel.getById(id);
      if (!existing)
        return res.status(404).json(formatError("Tiket tidak ditemukan"));

      await ticketsModel.delete(id);
      res.status(200).json(formatSuccess("Tiket telah dihapus", null));
    } catch (error) {
      res.status(500).json(formatError("Gagal menghapus tiket", error.message));
    }
  },

  cetakTicket: async (req, res) => {
    try {
      const { ticket_code } = req.body;
      const userId = req.user?.id;
      const username = req.user?.username;

      if (!userId)
        return res
          .status(401)
          .json(formatError("Unauthorized, token tidak valid"));
      if (!ticket_code || typeof ticket_code !== "string")
        return res.status(400).json(formatError("Kode tiket tidak valid"));

      const result = await ticketsModel.cetakTicketByCode(ticket_code, userId);

      if (!result)
        return res
          .status(404)
          .json(formatError("Tiket tidak ditemukan atau bukan milik Anda"));
      if (result === "unpaid")
        return res
          .status(403)
          .json(formatError("Tiket belum dibayar, tidak bisa dicetak"));

      res.status(200).json(
        formatSuccess("Tiket berhasil dicetak", {
          code: result.ticket_code,
          name: username,
          valid_until: result.valid_date,
          status: result.status,
          duration: result.duration_minutes,
          spot: result.fishing_spot?.name,
        })
      );
    } catch (error) {
      res
        .status(500)
        .json(
          formatError("Terjadi kesalahan saat mencetak tiket", error.message)
        );
    }
  },
};

export default TicketsController;
