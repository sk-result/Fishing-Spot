import prismaClient from "../database/dbConfig.js";

const usersModel = {
  create: async (data) => {
    return await prismaClient.users.create({ data });
  },
  getAll: async (options = {}) => {
    return await prismaClient.users.findMany(options);
  },
  getById: async (id) => {
    return await prismaClient.users.findUnique({ where: { id: Number(id) } });
  },
  getByEmail: async (email) => {
    return await prismaClient.users.findUnique({ where: { email } });
  },
  getByUsername: async (username) => {
    return await prismaClient.users.findUnique({ where: { username } });
  },
  update: async (id, data) => {
    return await prismaClient.users.update({
      where: { id: Number(id) },
      data,
    });
  },
  delete: async (id) => {
    return await prismaClient.users.delete({ where: { id: Number(id) } });
  },
};

export default usersModel;
