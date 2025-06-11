import prisma from "../database/dbConfig.js";

const reviewModel = {
  create: async (data) => {
    return await prisma.review.create({ data });
  },

  getAll: async () => {
    return await prisma.review.findMany({
      include: {
        fishingSpot: true,
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

  getByFishingSpotId: async (spotId) => {
    return await prisma.review.findMany({
      where: { fishing_spot_id: spotId },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { created_at: "desc" },
    });
  },

  getByUserId: async (userId) => {
    return await prisma.review.findMany({
      where: {
        user_id: userId,
      },
      include: {
        fishingSpot: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  getById: async (id) => {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
         fishingSpot: true,
      },
    });
  },

  update: async (id, data) => {
    return await prisma.review.update({
      where: { id },
      data,
    });
  },

  delete: async (id) => {
    return await prisma.review.delete({
      where: { id },
    });
  },

  averageRatingBySpot: async (spotId) => {
    const result = await prisma.review.aggregate({
      where: { fishing_spot_id: spotId },
      _avg: { rating: true },
    });
    return result._avg.rating;
  },

  checkFishingSpotExist: async (id) => {
    const spot = await prisma.fishing.findUnique({
      where: { id },
    });
    return !!spot;
  },
};

export default reviewModel;
