import prismaClient from "../database/dbConfig.js";

const ticketsModel = {
  create: async (data) => {
    return await prismaClient.tickets.create({ data });
  },
  getAll: async () => {
    return await prismaClient.tickets.findMany({
      include: {
        fishing_spot: true, // jika ingin sertakan detail spot
        user: true, // jika ingin sertakan data user
      },
    });
  },
  update: async (id, data) => {
    return await prismaClient.tickets.update({
      where: { id: Number(id) },
      data,
    });
  },
  getById: async (id) => {
    return await prismaClient.tickets.findUnique({
      where: { id: Number(id) },
      include: {
        fishing_spot: true,
        user: true,
      },
    });
  },
  delete: async (id) => {
    return await prismaClient.tickets.delete({
      where: { id: Number(id) },
    });
  },
  getFishingSpotById: async (fishing_spot_id) => {
    return await prismaClient.fishing.findUnique({
      where: { id: fishing_spot_id },
    });
  },
  // dalam createTicketsModel di ticketsModel.js
  cetakTicketByCode: async (ticket_code, user_id) => {
    const ticket = await prismaClient.tickets.findFirst({
      where: {
        ticket_code,
        user_id,
      },
      include: {
        fishing_spot: true,
      },
    });

    if (!ticket) return null;

    if (ticket.status_pembayaran !== "paid") return "unpaid";

    const valid_date = new Date();
    valid_date.setDate(valid_date.getDate() + 7);

    const updated = await prismaClient.tickets.update({
      where: { id: ticket.id },
      data: { valid_date },
    });

    return {
      ...updated,
      fishing_spot: ticket.fishing_spot,
    };
  },

  findByCode: async (code) => {
    return await prismaClient.tickets.findFirst({
      where: { ticket_code: code },
    });
  },
  updatePaymentStatus: async (id, status_pembayaran) => {
    return await prismaClient.tickets.update({
      where: { id: id },
      data: { status_pembayaran },
    });
  },
};

export default ticketsModel;
