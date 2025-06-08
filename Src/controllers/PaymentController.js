import { StatusPayment } from "@prisma/client";
import paymentModel from "../models/paymentModel.js";
import ticketsModel from "../models/ticketsModel.js";
import validasiPayment from "../validator/validasi_payment.js";
import fishingModel from "../models/fishingModel.js";

const PaymentController = {
  PaymentTicket: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized, token tidak valid",
        });
      }

      // Validasi input
      const { error, value } = validasiPayment.validate(req.body, {
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

      // Ambil tiket berdasarkan kode
      const ticket = await ticketsModel.getByCode(value.code);
      if (!ticket) {
        return res.status(404).json({
          status: "error",
          message: "Tiket tidak ditemukan",
        });
      }

      const fishingSpot = await fishingModel.getById(ticket.fishing_spot_id);

      if (!fishingSpot) {
        return res.status(404).json({
          status: "error",
          message: "Tempat memancing tidak ditemukan",
        });
      }

      const expectedAmount =
        fishingSpot.price_per_hour * (ticket.duration_minutes / 60);

      // Validasi jumlah pembayaran
      if (value.amount !== expectedAmount) {
        return res.status(400).json({
          status: "error",
          message: `Jumlah pembayaran harus sesuai harga tiket: ${expectedAmount}`,
        });
      }

      // Cek apakah tiket milik user
      if (ticket.user_id !== userId) {
        return res.status(403).json({
          status: "error",
          message: "Tiket bukan milik Anda",
        });
      }

      // Cek apakah tiket sudah dibayar
      if (ticket.status_pembayaran === StatusPayment.paid) {
        return res.status(400).json({
          status: "error",
          message: "Tiket sudah dibayar",
        });
      }

      // Cek apakah sudah ada payment terkait (karena ticket_id unik di payment)
      const existingPayment = await paymentModel.getByTicketId(ticket.id);
      if (existingPayment) {
        return res.status(400).json({
          status: "error",
          message: "Pembayaran untuk tiket ini sudah ada",
        });
      }

      // Buat data pembayaran
      const paymentData = {
        ticket_id: ticket.id,
        amount: value.amount,
        status: StatusPayment.paid, // set status paid di payment
        created_at: new Date(),
      };

      // Simpan payment
      const payment = await paymentModel.create(paymentData);

      // Update status pembayaran tiket
      await ticketsModel.update(ticket.id, {
        status_pembayaran: StatusPayment.paid,
        updated_at: new Date(),
      });

      // Response sukses
      res.status(201).json({
        status: "success",
        message: "Pembayaran berhasil",
        data: {
          payment_id: payment.id,
          ticket_code: ticket.ticket_code,
          amount: payment.amount,
          paid_at: payment.created_at,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal melakukan pembayaran",
        error: error.message,
      });
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const payments = await paymentModel.getAll();
      res.status(200).json({ status: "success", data: payments });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data pembayaran",
        error: error.message,
      });
    }
  },

  getPaymentById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({
          status: "error",
          message: "ID pembayaran tidak valid",
        });

      const payment = await paymentModel.getById(id);
      if (!payment)
        return res.status(404).json({
          status: "error",
          message: "Pembayaran tidak ditemukan",
        });

      res.status(200).json({ status: "success", data: payment });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data pembayaran",
        error: error.message,
      });
    }
  },

  deletePayment: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({
          status: "error",
          message: "ID pembayaran tidak valid",
        });

      const payment = await paymentModel.getById(id);
      if (!payment)
        return res.status(404).json({
          status: "error",
          message: "Pembayaran tidak ditemukan",
        });

      await paymentModel.delete(id);
      res.status(200).json({
        status: "success",
        message: "Pembayaran berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menghapus pembayaran",
        error: error.message,
      });
    }
  },
};

export default PaymentController;
