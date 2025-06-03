import prisma from "../models/prismaClient.js";

const ReviewController = {
  // ✍️ Create new Review
  create: async (req, res) => {
    try {
      const { userId, fishingSpotId, rating, comment } = req.body;

      // Validasi input
      if (!userId || !fishingSpotId || !rating) {
        return res.status(400).json({ error: "userId, fishingSpotId, and rating are required" });
      }


      const newReview = await prisma.review.create({
        data: {
          userId,
          fishing_spot_id: fishingSpotId,
          rating,
          comment,
        },
      });

      res.status(201).json(newReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // 🔍 Get all reviews with related user & spot
  getAll: async (req, res) => {
    try {
      const reviews = await prisma.review.findMany({
        include: {
          user: { select: { username: true } },
          fishingSpot: { select: { name: true } },
        },
      });

      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // 🔍 Get all reviews by Spot ID
  getBySpotId: async (req, res) => {
    const spotId = Number(req.params.spotId);
    if (isNaN(spotId)) {
      return res.status(400).json({ error: "Invalid spot ID" });
    }
    try {
      const reviews = await prisma.review.findMany({
        where: { fishing_spot_id: spotId },
        include: {
          user: { select: { username: true } },
        },
      });

      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch reviews for this spot" });
    }
  },
};

export default ReviewController;
