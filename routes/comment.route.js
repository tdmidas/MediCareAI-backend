const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

// Route to create a new comment
router.post("/", commentController.createComment);

// Route to get all comments for a blog post
router.get("/blog/:blogId", commentController.getAllCommentsForBlog);

// Route to get a single comment by commentId
router.get("/:commentId", commentController.getCommentById);

// Route to update a comment by commentId
router.put("/:commentId", commentController.updateComment);

// Route to delete a comment by commentId
router.delete("/:commentId", commentController.deleteComment);

// Export router
module.exports = router;
