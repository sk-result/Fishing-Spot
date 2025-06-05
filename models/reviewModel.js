import prisma from "../database/dbConfig.js";

const reviewModel = {
  create: async (data) => {
    return await prisma.review.create({ data });
  },

  getAll: async () => {
    return await prisma.review.findMany({
      include: {
        user: { select: { username: true } },
        fishingSpot: { select: { name: true } },
      },
    });
  },

  getByFishingSpotId: async (spotId) => {
    return await prisma.review.findMany({
      where: { fishing_spot_id: spotId },
      include: {
        user: { select: { username: true } },
      },
    });
  },
};

export default reviewModel;
