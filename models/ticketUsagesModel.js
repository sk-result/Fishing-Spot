import prismaClient from "../database/dbConfig.js";

const usagesModel = {
  create: async (data) => {
    return await prismaClient.ticketUsage.create({ data });
  },
  getAll: async () => {
    return await prismaClient.ticketUsage.findMany();
  },
  update: async (id, data) => {
    return await prismaClient.ticketUsage.update({
      where: { id: Number(id) },
      data,
    });
  },
  getById: async (id) => {
    return await prismaClient.ticketUsage.findUnique({
      where: { id: Number(id) },
    });
  },
  delete: async (id) => {
    return await prismaClient.ticketUsage.delete({ where: { id: Number(id) } });
  },
};

export default usagesModel;
