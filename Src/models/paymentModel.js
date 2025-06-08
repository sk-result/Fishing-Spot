import prismaClient from "../database/dbConfig.js";

const paymentModel = {
  create: async (data) => {
    return await prismaClient.payment.create({ data });
  },
  getAll: async () => {
    return await prismaClient.payment.findMany({
      include: {
        ticket: true, // kalau kamu mau join tiket, bisa sesuaikan
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },
  getById: async (id) => {
    return await prismaClient.payment.findUnique({
      where: { id: Number(id) },
      include: {
        ticket: true,
      },
    });
  },
  delete: async (id) => {
    return await prismaClient.payment.delete({
      where: { id: Number(id) },
    });
  },
  getByTicketId: async (ticketId) => {
    return await prismaClient.payment.findUnique({
      where: { ticket_id: ticketId },
    });
  },
 
};

export default paymentModel;
