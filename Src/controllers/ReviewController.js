import reviewSchema from "../validator/validasi_review.js";
import reviewModel from "../models/reviewModel.js";

const ReviewController = {
  create: async (req, res) => {
    try {
      const { error, value } = reviewSchema.reviewCreateSchema.validate(
        req.body,
        {
          abortEarly: false,
        }
      );

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: "Validasi gagal", errors });
      }

      const userId = req.user?.id;
      const username = req.user?.username || "Anonymous";

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token tidak valid" });
      }

      const fishingSpotExists = await reviewModel.checkFishingSpotExist(
        value.fishing_spot_id
      );

      if (!fishingSpotExists) {
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
      return res.status(400).json({ error: "ID spot tidak valid" });
    }

    try {
      const reviews = await reviewModel.getByFishingSpotId(spotId);
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Gagal mengambil review untuk spot ini" });
    }
  },

  update: async (req, res) => {
    const reviewId = parseInt(req.params.id);
    if (isNaN(reviewId)) {
      return res.status(400).json({ message: "ID review tidak valid" });
    }

    const { rating, comment } = req.body;

    const { error, value } = reviewSchema.reviewUpdateSchema.validate(
      { rating, comment },
      { abortEarly: false }
    );
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: "Validasi gagal", errors });
    }

    try {
      const review = await reviewModel.getById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review tidak ditemukan" });
      }

      const updated = await reviewModel.update(reviewId, {
        rating: value.rating,
        comment: value.comment,
      });

      res.json({ message: "Review diperbarui", data: updated });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const reviewId = parseInt(req.params.id);
    if (isNaN(reviewId)) {
      return res.status(400).json({ message: "ID review tidak valid" });
    }

    try {
      const review = await reviewModel.getById(reviewId);

      if (!review) {
        return res.status(404).json({ message: "Review tidak ditemukan" });
      }

      await reviewModel.delete(reviewId);
      res.json({ message: "Review berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getByUserId: async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID user tidak valid" });
    }

    try {
      const reviews = await reviewModel.getByUserId(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil review user" });
    }
  },

  getAverageRating: async (req, res) => {
    const spotId = parseInt(req.params.spotId);
    if (isNaN(spotId)) {
      return res.status(400).json({ error: "ID spot tidak valid" });
    }

    try {
      const avg = await reviewModel.averageRatingBySpot(spotId);
      res.json({ fishing_spot_id: spotId, average_rating: avg || 0 });
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil rating rata-rata" });
    }
  },
};

export default ReviewController;
