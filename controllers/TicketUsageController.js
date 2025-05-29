import prisma from "../models/prismaClient.js";
  
const ticketUsageController = {
  // Create new TicketUsage
  create: async (req, res) => {
    try {
      const { userId, ticketId, usedAt, durationUsed, fishingSpotId } =
        req.body;

      // Validasi input
      if (!userId || !ticketId || !usedAt || !durationUsed || !fishingSpotId) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Bisa tambah validasi lebih lanjut, misal cek apakah userId, ticketId, fishingSpotId valid di DB

      // Create record
      const newUsage = await prisma.ticketUsage.create({
        data: {
          userId,
          ticketId,
          usedAt: new Date(usedAt),
          durationUsed,
          fishingSpotId,
        },
      });

      res.status(201).json(newUsage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all TicketUsage with related data
  getAll: async (req, res) => {
    try {
      const usages = await prisma.ticketUsage.findMany({
        include: {
          user: true,
          ticket: true,
          fishingSpot: true,
        },
      });

      res.json(usages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default ticketUsageController;
