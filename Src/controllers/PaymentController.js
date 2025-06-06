import paymentModel from "../models/paymentModel.js";
import ticketsModel from "../models/ticketsModel.js";
import validasiPayment from "../validator/validasi_payment.js";

const Payment = {
  PaymentTicket: async (req, res) => {
    // ... kode pembayaran tiket yang sudah ada ...
  },

  // Untuk admin: lihat semua pembayaran
  getAllPayments: async (req, res) => {
    try {
      const payments = await paymentModel.getAll();
      res.status(200).json(payments);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Gagal mengambil data pembayaran",
          error: error.message,
        });
    }
  },

  // Untuk admin: lihat detail pembayaran berdasarkan id pembayaran
  getPaymentById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ message: "ID pembayaran tidak valid" });

      const payment = await paymentModel.getById(id);
      if (!payment)
        return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

      res.status(200).json(payment);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Gagal mengambil data pembayaran",
          error: error.message,
        });
    }
  },

  // Untuk admin: hapus pembayaran
  deletePayment: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ message: "ID pembayaran tidak valid" });

      const payment = await paymentModel.getById(id);
      if (!payment)
        return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

      await paymentModel.delete(id);
      res.status(200).json({ message: "Pembayaran berhasil dihapus" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Gagal menghapus pembayaran", error: error.message });
    }
  },
};

export default Payment;
