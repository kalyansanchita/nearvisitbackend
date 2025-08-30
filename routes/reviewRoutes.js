const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authenticateToken = require("../middleware/authMiddleware");

// POST: Submit a review
// POST: Submit or update review
router.post("/", authenticateToken, async (req, res) => {
  const { listingId, rating, reviewText } = req.body;
  const userId = req.user._id;
  const userEmail = req.user.email;

  if (!listingId || !rating || !reviewText) {
    return res.status(400).json({ message: "Rating and review are required." });
  }

  try {
    const existingReview = await Review.findOne({ listingId, userId });

    if (existingReview) {
      // Update the existing review
      existingReview.rating = rating;
      existingReview.reviewText = reviewText;
      existingReview.updatedAt = Date.now();
      await existingReview.save();

      return res.json({ message: "Review updated successfully." });
    } else {
      // Create a new review
      const newReview = new Review({
        listingId,
        userEmail,
        rating,
        reviewText,
      });

      await newReview.save();
      return res
        .status(201)
        .json({ message: "Review submitted successfully." });
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({ message: "Failed to submit review." });
  }
});

// GET: Get all reviews for a listing
router.get("/:listingId", authenticateToken, async (req, res) => {
  const { listingId } = req.params;

  try {
    const reviews = await Review.find({ listingId }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

module.exports = router;
