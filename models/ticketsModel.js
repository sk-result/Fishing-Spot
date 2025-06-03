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
};

export default ticketsModel;
