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
};

export default TicketsController;
