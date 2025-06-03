import prisma from "../models/usersMode;.js";
import validasiPayment from "../validator/validasi_payment.js";

const Payment = {
  // POST /payments/initiate
  PaymentTicket: async (req, res) => {
    try {
      const { code, amount } = req.body;
      const { error } = validasiPayment.validate({ code, amount });
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }

      const ticket = await prisma.tickets.findFirst({
        where: { ticket_code: code },
      });

      if (!ticket) {
        return res.status(400).json({
          message: "Tiket tidak ditemukan",
        });
      }

      if (ticket.status_pembayaran === "paid") {
        return res.status(400).json({
          message: "Tiket sudah dibayar",
        });
      }

      const existingPayment = await prisma.payment.findUnique({
        where: { ticket_id: ticket.id },
      });
      if (existingPayment) {
        return res.status(400).json({
          message: "Pembayaran sudah tercatat untuk tiket ini",
        });
      }

      const newPayment = await prisma.payment.create({
        data: {
          ticket_id: ticket.id,
          amount,
          status: "paid",
        },
      });

      await prisma.tickets.update({
        where: { id: ticket.id },
        data: {
          status_pembayaran: "paid",
        },
      });

      return res.status(201).json({
        message: "Pembayaran berhasil ",
        newPayment,
      });
    } catch (error) {
      console.error("PaymentTicket error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
  },
};
export default Payment;
