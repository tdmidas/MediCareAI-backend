const express = require("express");
const router = express.Router();
const { createReview, getAllReviewsDoctor, updateReview, deleteReview } = require("../controllers/review.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
// Create a new review
router.post("/", createReview);

// Get all reviews
router.get("/:id", getAllReviewsDoctor);

// Update a review by reviewId
router.put("/:reviewId", authenticate, authorize, updateReview);

// Delete a review by reviewId
router.delete("/:reviewId", authenticate, authorize, deleteReview);

module.exports = router;
