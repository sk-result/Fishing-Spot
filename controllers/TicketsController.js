import prisma from "../models/prismaClient.js";
import validasiSchema from "../validator/validasi_tickets.js";

const TicketsController = {
  GetAll: async (req, res, next) => {
    try {
      const tickets = await prisma.tickets.findMany();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Ticket tidak ada",
        error: error.message,
      });
    }
  },

  GetById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ message: "ID tiket tidak valid" });

      const ticket = await prisma.tickets.findUnique({ where: { id } });
      if (!ticket) {
        return res.status(404).json({ message: "Tiket tidak ditemukan" });
      }

      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Tiket tidak ada",
        error: error.message,
      });
    }
  },

  create: async (req, res, next) => {
    try {
      const body = req.body;
      const { error, value } = validasiSchema.validate(body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      const userId = req.user?.id;
      const username = req.user?.username;
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }

      // Ambil data fishing spot (harga per jam)
      const fishingSpot = await prisma.fishing.findUnique({
        where: { id: value.fishing_spot_id },
      });

      if (!fishingSpot) {
        return res
          .status(404)
          .json({ message: "Spot memancing tidak ditemukan" });
      }

      const pricePerHour = Number(fishingSpot.price_per_hour); // Decimal harus di-convert ke Number
      const duration = value.duration_minutes || 60;
      const totalPrice = (pricePerHour * duration) / 60;

      const ticket_code = `T-${Date.now().toString().slice(-4)}${Math.floor(
        Math.random() * 100
      )}`;
      const valid_date = new Date();
      valid_date.setDate(valid_date.getDate() + 3);
      const status = "unused";

      const newTicket = await prisma.tickets.create({
        data: {
          ticket_code,
          fishing_spot_id: value.fishing_spot_id,
          valid_date,
          status,
          duration_minutes: duration,
          user_id: userId,
          created_at: new Date(),
        },
      });

      res.status(201).json({
        message: "Tiket berhasil dibuat",
        data: {
          code: newTicket.ticket_code,
          name: username,
          payment_expired: newTicket.valid_date,
          status,
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

  update: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);

      const body = req.body;
      const { error, value } = validasiSchema.validate(body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      const userId = req.user?.id;
      const username = req.user?.username;
      // Ambil data fishing spot (harga per jam)
      const fishingSpot = await prisma.fishing.findUnique({
        where: { id: value.fishing_spot_id },
      });

      if (!fishingSpot) {
        return res
          .status(404)
          .json({ message: "Spot memancing tidak ditemukan" });
      }

      const pricePerHour = Number(fishingSpot.price_per_hour); // Decimal harus di-convert ke Number
      const duration = value.duration_minutes || 60;
      const totalPrice = (pricePerHour * duration) / 60;

      const valid_date = new Date();
      valid_date.setDate(valid_date.getDate() + 7);
      const status = "unused";

      const newTicket = await prisma.tickets.update({
        where: { id },
        data: {
          // ticket_code,
          fishing_spot_id: value.fishing_spot_id,
          valid_date,
          status,
          duration_minutes: duration,
          user_id: userId,
          created_at: new Date(),
        },
      });

      res.status(201).json({
        message: "Tiket berhasil dibuat",
        data: {
          code: newTicket.ticket_code,
          name: username,
          valid_until: newTicket.valid_date,
          duration_minutes: duration,

          status,
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

  delete: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ message: "ID tiket tidak valid" });

      const existing = await prisma.tickets.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: "Tiket tidak ditemukan." });
      }

      await prisma.tickets.delete({ where: { id } });
      res.status(200).json({ message: "Tiket telah dihapus" });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menghapus tiket.",
        error: error.message,
      });
    }
  },

  cetakTicket: async (req, res, next) => {
    try {
      const { ticket_code } = req.body;
      const userId = req.user?.id;
      const username = req.user?.username;

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }

      if (!ticket_code) {
        return res.status(400).json({ message: "Kode tiket wajib diisi" });
      }

      const ticket = await prisma.tickets.findFirst({
        where: {
          ticket_code,
          user_id: userId,
        },
        include: {
          fishing_spot: true,
        },
      });

      if (!ticket) {
        return res
          .status(404)
          .json({ message: "Tiket tidak ditemukan atau bukan milik Anda" });
      }

      if (ticket.status_pembayaran !== "paid") {
        return res
          .status(403)
          .json({ message: "Tiket belum dibayar, tidak bisa dicetak" });
      }

      // Set valid date menjadi hari ini + 7
      const valid_date = new Date();
      valid_date.setDate(valid_date.getDate() + 7);

      const updatedTicket = await prisma.tickets.update({
        where: { id: ticket.id },
        data: {
          valid_date,
        },
      });

      res.status(200).json({
        message: "Tiket berhasil dicetak",
        data: {
          code: updatedTicket.ticket_code,
          name: username,
          valid_until: updatedTicket.valid_date,
          status: updatedTicket.status,
          duration: updatedTicket.duration_minutes,
          spot: ticket.fishing_spot?.name,
        },
      });
    } catch (error) {
      console.error("cetakTicket error:", error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mencetak tiket",
        error: error.message,
      });
    }
  },
};

export default TicketsController;
