// models/ticketsModel.js
import prismaClient from "../database/dbConfig.js";

const ticketsModel = {
  // Ambil semua tiket, termasuk data spot dan user terkait
  getAll: async () => {
    return await prismaClient.tickets.findMany({
      include: {
        fishing_spot: true,
        user: { select: { id: true, username: true } },
      },
      orderBy: { created_at: "desc" },
    });
  },

  // Ambil tiket berdasarkan ID
  getById: async (id) => {
    return await prismaClient.tickets.findUnique({
      where: { id },
      include: {
        fishing_spot: true,
        user: { select: { id: true, username: true } },
      },
    });
  },

  // Ambil semua tiket milik user tertentu
  getByUserId: async (userId) => {
    return await prismaClient.tickets.findMany({
      where: { user_id: userId },
      include: { fishing_spot: true },
      orderBy: { created_at: "desc" },
    });
  },

  // Ambil data spot memancing berdasarkan ID
  getFishingSpotById: async (id) => {
    return await prismaClient.fishing.findUnique({ where: { id } });
  },

  // Buat tiket baru
  create: async (data) => {
    return await prismaClient.tickets.create({ data });
  },

  // Update tiket berdasarkan ID
  update: async (id, data) => {
    return await prismaClient.tickets.update({
      where: { id },
      data,
    });
  },

  // Hapus tiket berdasarkan ID
  delete: async (id) => {
    return await prismaClient.tickets.delete({ where: { id } });
  },

  // Cetak tiket berdasarkan kode dan user
  cetakTicketByCode: async (ticket_code, user_id) => {
    const ticket = await prismaClient.tickets.findFirst({
      where: { ticket_code, user_id },
      include: { fishing_spot: true },
    });

    if (!ticket) return null;
    if (ticket.status_pembayaran !== "paid") return "unpaid"; // lebih eksplisit

    return ticket;
  },
  getByCode: async (code) => {
    return await prismaClient.tickets.findUnique({
      where: { ticket_code: code },
    });
  },
  
  updateStatus: async (id, status) => {
    return await prismaClient.tickets.update({
      where: { id },
      data: {
        status,
        updated_at: new Date(),
      },
    });
  },
};

export default ticketsModel;
