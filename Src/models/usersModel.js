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
  // Ambil user berdasarkan email yang belum dihapus
  getByEmailNotDeleted: async (email) => {
    return prismaClient.users.findFirst({
      where: {
        email,
        deleted: false,
      },
    });
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
  softDelete: async (id) => {
    return await prismaClient.users.update({
      where: { id: Number(id) },
      data: { deleted: true },
    });
  },
};

export default usersModel;
