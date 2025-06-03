import usagesModel from "../models/ticketUsagesModel.js";
import { TicketUsageSchema } from "../validator/validasi_usage.js";
import prismaClient from "../database/dbConfig.js";

const ticketUsageController = {
  useTicket: async (req, res) => {
    try {
      const { error } = TicketUsageSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { codeTiket } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const ticket = await prismaClient.tickets.findFirst({
        where: { ticket_code: codeTiket },
      });

      if (!ticket) {
        return res.status(404).json({ message: "Tiket tidak ditemukan" });
      }

      if (ticket.user_id !== userId) {
        return res.status(403).json({ message: "Tiket bukan milikmu" });
      }

      if (ticket.status === "used") {
        return res.status(400).json({ message: "Tiket sudah digunakan" });
      }

      if (ticket.status_pembayaran === "unpaid") {
        return res.status(400).json({ message: "Tiket belum dibayar" });
      }

      const now = new Date();
      if (ticket.valid_date < now) {
        await prismaClient.tickets.update({
          where: { id: ticket.id },
          data: { status: "expired" },
        });
        return res.status(400).json({ message: "Tiket sudah kedaluwarsa" });
      }

      // Simpan ke ticket_usages
      const usage = await usagesModel.create({
        userId,
        ticketId: ticket.id,
        usedAt: now,
        durationUsed: ticket.duration_minutes,
        fishingSpotId: ticket.fishing_spot_id,
      });

      // Update status tiket
      await prismaClient.tickets.update({
        where: { id: ticket.id },
        data: { status: "used" },
      });

      res.status(200).json({
        message: "Tiket berhasil digunakan",
        ticket_code: ticket.ticket_code,
        usage,
      });
    } catch (error) {
      res.status(500).json({
        message: "Gagal menggunakan tiket",
        error: error.message,
      });
    }
  },
};

export default ticketUsageController;
