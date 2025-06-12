import prismaClient from "../database/dbConfig.js";

const fishingModel = {
  create: async (data) => {
    return await prismaClient.fishing.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  getAll: async () => {
    return await prismaClient.fishing.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  getById: async (id) => {
    return await prismaClient.fishing.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
  },
  update: async (id, data) => {
    return await prismaClient.fishing.update({
      where: { id: Number(id) },
      data,
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
  },
  delete: async (id) => {
    return await prismaClient.fishing.delete({ where: { id: Number(id) } });
  },
};

export default fishingModel;
