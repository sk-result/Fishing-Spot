import prismaClient from "../database/dbConfig.js";

const fishingModel = {
  create: async (data) => {
    return await prismaClient.fishing.create({ data });
  },
  getAll: async () => {
    return await prismaClient.fishing.findMany();
  },
  getById: async (id) => {
    return await prismaClient.fishing.findUnique({ where: { id: Number(id) } });
  },
  update: async (id, data) => {
    return await prismaClient.fishing.update({
      where: { id: Number(id) },
      data,
    });
  },
  delete: async (id) => {
    return await prismaClient.fishing.delete({ where: { id: Number(id) } });
  },
};

export default fishingModel;
