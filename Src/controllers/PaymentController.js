import paymentModel from "../models/paymentModel.js";
import ticketsModel from "../models/ticketsModel.js";
import validasiPayment from "../validator/validasi_payment.js";

const Payment = {
  PaymentTicket: async (req, res) => {
    try {
      const { code, amount } = req.body;
      const { error } = validasiPayment.validate({ code, amount });
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }

      const ticket = await ticketsModel.findByCode(code);

      if (!ticket) {
        return res.status(400).json({ message: "Tiket tidak ditemukan" });
      }

      if (ticket.status_pembayaran === "paid") {
        return res.status(400).json({ message: "Tiket sudah dibayar" });
      }

      const existingPayment = await paymentModel.getByTicketId(ticket.id);

      if (existingPayment) {
        return res.status(400).json({
          message: "Pembayaran sudah tercatat untuk tiket ini",
        });
      }

      const newPayment = await paymentModel.create({
        ticket_id: ticket.id,
        amount,
        status: "paid",
      });

      await ticketsModel.updatePaymentStatus(ticket.id, "paid");

      return res.status(201).json({
        message: "Pembayaran berhasil",
        newPayment,
      });
    } catch (error) {
      console.error("PaymentTicket error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server." });
    }
  },
};

export default Payment;
