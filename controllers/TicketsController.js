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
      valid_date.setDate(valid_date.getDate() + 7);
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
          valid_until: newTicket.valid_date,
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
      if (isNaN(id))
        return res.status(400).json({ message: "ID tiket tidak valid" });

      const { error, value } = validasiSchema.validate(req.body, {
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

      const updatedTicket = await prisma.tickets.update({
        where: { id },
        data: {
          ticket_code: value.ticket_code,
          fishing_spot_id: value.fishing_spot_id,
          valid_date: new Date(`${value.valid_date}T00:00:00.000Z`),
          status: value.status,
          duration_minutes: value.duration_minutes,
          user_id: userId,
        },
      });

      res.status(200).json(updatedTicket);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui tiket",
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

  BuyTickets: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }

      const { ticket_code, amount } = req.body;
      if (!ticket_code) {
        return res.status(400).json({ message: "ticket_code wajib diisi" });
      }
      if (!amount || amount <= 0) {
        return res
          .status(400)
          .json({ message: "amount pembayaran wajib diisi dan harus > 0" });
      }

      // Cari tiket berdasarkan ticket_code
      const ticket = await prisma.tickets.findUnique({
        where: { ticket_code },
      });
      if (!ticket) {
        return res.status(404).json({ message: "Tiket tidak ditemukan" });
      }

      // Cek apakah sudah ada pembayaran untuk tiket ini
      const existingPayment = await prisma.payment.findFirst({
        where: { ticket_id: ticket.id },
      });

      if (existingPayment && existingPayment.status === "used") {
        return res.status(400).json({ message: "Tiket sudah dibayar" });
      }

      // Buat transaksi pembayaran dan update status tiket
      const payment = await prisma.$transaction(async (tx) => {
        // Jika belum ada payment, buat baru, kalau sudah ada update paymentnya
        if (!existingPayment) {
          await tx.payment.create({
            data: {
              ticket_id: ticket.id,
              amount,
              status: "used",
              payment_date: new Date(),
              created_at: new Date(),
            },
          });
        } else {
          await tx.payment.update({
            where: { id: existingPayment.id },
            data: {
              amount,
              status: "used",
              payment_date: new Date(),
            },
          });
        }

        // Update status tiket jadi 'used' (atau sesuai kebutuhan)
        return tx.tickets.update({
          where: { id: ticket.id },
          data: { status: "used" },
        });
      });

      res.status(200).json({
        message: "Pembayaran berhasil, tiket sudah aktif",
        ticket: payment,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal melakukan pembayaran",
        error: error.message,
      });
    }
  },

  CetakTiket: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ message: "ID tiket tidak valid" });

      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }

      const ticket = await prisma.tickets.findUnique({
        where: { id },
        include: { payment: true },
      });

      if (!ticket) {
        return res.status(404).json({ message: "Tiket tidak ditemukan" });
      }

      if (!ticket.payment || ticket.payment.status !== "used") {
        return res.status(402).json({ message: "Tiket belum dibayar." });
      }

      res.status(200).json({
        message: "Cetak tiket berhasil",
        ticket,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal cetak tiket",
        error: error.message,
      });
    }
  },
};

export default TicketsController;
