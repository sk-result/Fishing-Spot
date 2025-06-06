import reviewSchema from "../validator/validasi_review.js";
import reviewModel from "../models/reviewModel.js";
import prisma from "../database/dbConfig.js"; // masih dibutuhkan untuk cek spot

const ReviewController = {
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

      const newReview = await reviewModel.create({
        user_id: userId,
        fishing_spot_id: value.fishing_spot_id,
        rating: value.rating,
        comment: value.comment,
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

  getAll: async (req, res) => {
    try {
      const reviews = await reviewModel.getAll();
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getBySpotId: async (req, res) => {
    const spotId = Number(req.params.spotId);
    if (isNaN(spotId)) {
      return res.status(400).json({ error: "Invalid spot ID" });
    }

    try {
      const reviews = await reviewModel.getByFishingSpotId(spotId);
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch reviews for this spot" });
    }
  },
  update: async (req, res) => {
    const reviewId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    try {
      const review = await reviewModel.getById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review tidak ditemukan" });
      }

      if (review.user_id !== req.user.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Akses ditolak" });
      }

      const updated = await reviewModel.update(reviewId, { rating, comment });
      res.json({ message: "Review diperbarui", data: updated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const reviewId = parseInt(req.params.id);

    try {
      const review = await reviewModel.getById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review tidak ditemukan" });
      }

      if (review.user_id !== req.user.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Akses ditolak" });
      }

      await reviewModel.delete(reviewId);
      res.json({ message: "Review berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getByUserId: async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
      const reviews = await reviewModel.getByUserId(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil review user" });
    }
  },
};

export default ReviewController;
