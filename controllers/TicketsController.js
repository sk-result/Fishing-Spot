import prisma from "../models/prismaClient.js";
import validasiSchema from "../validator/validasi_tickets.js";

const TicketsController = {
  GetAll: async (req, res, next) => {
    try {
      const tickets = await prisma.tickets.findMany();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({
        Status: "error",
        message: "Ticket tidak ada",
        error: error.message,
      });
    }
  },

  GetById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const tickets = await prisma.tickets.findUnique({ where: { id } });
      if (!tickets) {
        return res.status(404).json({ error: "Tiket tidak ditemukan" });
      }

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({
        status: error,
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
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }

      // Simpan data tiket ke database
      const newTicket = await prisma.tickets.create({
        data: {
          ticket_code: value.ticket_code,
          fishing_spot_id: value.fishing_spot_id,
          valid_date: new Date(value.valid_date),
          status: value.status,
          duration_minutes: value.duration_minutes,
          user_id: userId,
          created_at: new Date(),
        },
      });
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({
        status: error,
        message: "Gagal!!",
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
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }
      const {
        ticket_code,
        fishing_spot_id,
        valid_date,
        status,
        duration_minutes,
      } = value;
      // Simpan data tiket ke database
      const newTicket = await prisma.tickets.update({
        where: { id },
        data: {
          ticket_code,
          fishing_spot_id,
          valid_date: new Date(`${valid_date}T00:00:00.000Z`),
          status,
          duration_minutes,
          user_id: userId,

          // user_id
          // created_at: new Date(),
        },
      });
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({
        status: error,
        message: "Gagal!!",
        error: error.message,
      });
    }
  },
  delete: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await prisma.tickets.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json({ message: "Tiket tidak ditemukan." });
      }

      await prisma.tickets.delete({ where: { id } });
      res.status(200).json({ message: "tiket telah dihapus" });
    } catch (error) {
      res.status(500).json({
        status: error,
        message: "Gagal menghapus tiket.",
        error: error.message,
      });
    }
  },
  BuyTickets: async (req, res, next) => {
    const userId = req.user?.id;
    try {
      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized, token tidak valid",
        });
      }

      const { fishing_spot_id, duration_minutes } = req.body;

      if (!fishing_spot_id) {
        return res.status(400).json({
          message: "fishing_spot_id wajib diisi",
        });
      }

      // Generate ticket_code unik (misal timestamp + random angka)
      const ticket_code = `TICK-${Date.now().toString().slice(-1)}-${Math.floor(
        Math.random() * 1000
      )}`;

      // Set valid_date hari ini (bisa disesuaikan)
      const valid_date = new Date();
      valid_date.setDate(valid_date.getDate() + 7);

      // Set status default
      const status = "unused";

      // Jika duration_minutes tidak dikirim, set default 60 menit
      const duration = duration_minutes || 60;

      // Buat tiket baru di database
      const newTicket = await prisma.tickets.create({
        data: {
          ticket_code,
          fishing_spot_id,
          valid_date,
          status,
          duration_minutes: duration,
          user_id: userId,
          created_at: new Date(),
        },
      });

      res
        .status(201)
        .json({ message: "Tiket berhasil dibeli", ticket: newTicket });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal membeli tiket",
        error: error.message,
      });
    }
  },
};

export default TicketsController;
