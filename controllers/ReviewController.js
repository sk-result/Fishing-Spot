import prisma from "../database/dbConfig.js";
import reviewSchema from "../validator/validasi_review.js";

const ReviewController = {
  // ✍️ Create new Review
  create: async (req, res) => {
    try {
      const { error, value } = reviewSchema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      const userId = req.user?.id;
      const username = req.user?.username;
      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }
      const fishingSpot = await prisma.fishing.findUnique({
        where: { id: value.fishing_spot_id },
      });

      if (!fishingSpot) {
        return res.status(404).json({
          message: "Tempat pemancingan tidak ditemukan",
        });
      }

      const newReview = await prisma.review.create({
        data: {
          user_id: userId,
          fishing_spot_id: value.fishing_spot_id,
          rating: value.rating,
          comment: value.comment,
        },
      });

      res.status(201).json({
        name: username,
        data: newReview,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
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
