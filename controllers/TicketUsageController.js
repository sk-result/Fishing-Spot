import prisma from "../models/prismaClient.js";


const ticketUsageController = {
  useTicket: async (req, res) => {
    try {
      const { ticketId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const ticket = await prisma.tickets.findUnique({
        where: { id: ticketId },
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

      const now = new Date();
      if (ticket.valid_date < now) {
        await prisma.tickets.update({
          where: { id: ticketId },
          data: { status: "expired" },
        });
        return res.status(400).json({ message: "Tiket sudah kedaluwarsa" });
      }

      // Hitung durasi penggunaan jika dibutuhkan
      const durationUsed = ticket.duration_minutes; // Atau bisa dihitung real time

      // Simpan ke ticket_usages
      const usage = await prisma.ticketUsage.create({
        data: {
          userId,
          ticketId,
          usedAt: now,
          durationUsed,
          fishingSpotId: ticket.fishing_spot_id,
        },
      });

      // Update status tiket ke 'used'
      await prisma.tickets.update({
        where: { id: ticketId },
        data: { status: "used" },
      });

      res.status(200).json({
        message: "Tiket berhasil digunakan",
        usage,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal menggunakan tiket",
        error: error.message,
      });
    }
  },
};

export default ticketUsageController;
