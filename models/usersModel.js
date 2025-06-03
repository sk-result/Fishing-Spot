import prismaClient from "../database/dbConfig.js";

const usersModel = {
  create: async (data) => {
    return await prismaClient.users.create({ data });
  },
  getAll: async () => {
    return await prismaClient.news.findMany();
  },
  update: async (id, data) => {
    return await prismaClient.news.update({ where: { id: Number(id) }, data });
  },
  getById: async (id) => {
    return await prismaClient.news.findUnique({ where: { id: Number(id) } });
  },
  delete: async (id) => {
    return await prismaClient.news.delete({ where: { id: Number(id) } });
  },
};
export default usersModel;
