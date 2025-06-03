import prismaClient from "../database/dbConfig.js";

const paymentModel = {
  create: async (data) => {
    return await prismaClient.payment.create({ data });
  },
  getAll: async () => {
    return await prismaClient.payment.findMany();
  },
  update: async (id, data) => {
    return await prismaClient.payment.update({
      where: { id: Number(id) },
      data,
    });
  },
  getById: async (id) => {
    return await prismaClient.payment.findUnique({
      where: { id: Number(id) },
    });
  },
  delete: async (id) => {
    return await prismaClient.payment.delete({
      where: { id: Number(id) },
    });
  },
};

export default paymentModel;
