// models/ticketsModel.js
import prisma from "../database/dbConfig.js";

const ticketsModel = {
  getAll: async () => {
    return await prisma.tickets.findMany({
      include: {
        fishing_spot: true,
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
  },

  getById: async (id) => {
    return await prisma.tickets.findUnique({
      where: { id },
      include: {
        fishing_spot: true,
        user: { select: { id: true, username: true } },
      },
    });
  },

  getByUserId: async (userId) => {
    return await prisma.tickets.findMany({
      where: { user_id: userId },
      include: {
        fishing_spot: true,
      },
      orderBy: { created_at: "desc" },
    });
  },

  getFishingSpotById: async (id) => {
    return await prisma.fishing_spot.findUnique({
      where: { id },
    });
  },

  create: async (data) => {
    return await prisma.tickets.create({ data });
  },

  update: async (id, data) => {
    return await prisma.tickets.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    return await prisma.tickets.delete({ where: { id } });
  },

  cetakTicketByCode: async (ticket_code, user_id) => {
    const ticket = await prisma.tickets.findFirst({
      where: { ticket_code, user_id },
      include: { fishing_spot: true },
    });

    if (!ticket) return null;

    if (ticket.status_pembayaran === "unpaid") return "unpaid";

    return ticket;
  },
};

export default ticketsModel;
