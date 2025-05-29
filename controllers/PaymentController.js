import prisma from "../models/prismaClient.js";
import validasiPayment from "../validator/validasi_payment.js";

const Payment = {
  // POST /payments/initiate
  initiatePayment: async (req, res) => {
    try {
      const userId = req.user?.id;
      const { error } = validasiPayment.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      if (!userId || !fishing_spot_id || !payment_method) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      const spot = await prisma.fishing.findUnique({
        where: { id: fishing_spot_id },
      });

      if (!spot) {
        return res.status(404).json({ message: "Spot tidak ditemukan" });
      }

      const duration = duration_minutes || 60;
      const amount = Number(spot.price_per_hour) * (duration / 60);

      const payment = await prisma.payment.create({
        data: {
          user_id: userId,
          amount,
          payment_method,
          payment_status: "PENDING",
        },
      });

      res.status(201).json({ message: "Pembayaran dimulai", payment });
    } catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
  },

  // POST /payments/:id/pay
  payAndGenerateTicket: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const userId = req.user?.id;

      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment || payment.user_id !== userId) {
        return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
      }

      if (payment.payment_status === "PAID") {
        return res.status(400).json({ message: "Sudah dibayar" });
      }

      // Simpan tiket
      const ticket = await prisma.tickets.create({
        data: {
          ticket_code: `TICKET-${Date.now().toString().slice(-6)}`,
          fishing_spot_id: 1, // kamu bisa ambil dari payload/logic
          valid_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default 7 hari
          status: "unused",
          duration_minutes: 60,
          user_id: userId,
          created_at: new Date(),
        },
      });

      // Update payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          payment_status: "PAID",
          paid_at: new Date(),
          ticketId: ticket.id,
        },
      });

      res.status(200).json({ message: "Pembayaran berhasil", ticket });
    } catch (error) {
      res.status(500).json({ message: "Gagal bayar", error: error.message });
    }
  },
};
export default Payment;
