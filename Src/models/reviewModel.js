import prisma from "../database/dbConfig.js";

const reviewModel = {
  // Buat review baru
  create: async (data) => {
    return await prisma.review.create({
      data,
    });
  },

  // Ambil semua review
  getAll: async () => {
    return await prisma.review.findMany({
      include: {
        fishing_spot: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  // Ambil semua review berdasarkan fishing spot ID
  getByFishingSpotId: async (spotId) => {
    return await prisma.review.findMany({
      where: {
        fishing_spot_id: spotId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  // Ambil semua review dari user tertentu (opsional)
  getByUserId: async (userId) => {
    return await prisma.review.findMany({
      where: {
        user_id: userId,
      },
      include: {
        fishing_spot: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  // Ambil satu review berdasarkan ID
  getById: async (id) => {
    return await prisma.review.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        fishing_spot: true,
      },
    });
  },

  // Update review
  update: async (id, data) => {
    return await prisma.review.update({
      where: { id },
      data,
    });
  },

  // Hapus review
  delete: async (id) => {
    return await prisma.review.delete({
      where: { id },
    });
  },

};

export default reviewModel;
