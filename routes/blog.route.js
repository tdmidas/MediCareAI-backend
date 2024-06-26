const express = require("express");
const router = express.Router();
const {
	getAllBlogs,
	getBlogById,
	createBlog,
	updateBlog,
	deleteBlog,
	getMyBlogs,
	increaseLike,
} = require("../controllers/blog.controller");

// Get all Blog route
router.get("/", getAllBlogs);
// Get Blog by Id route
router.get("/", getBlogById);
// Get My Blogs route
router.get("/my/:id", getMyBlogs);
// Increase Like route
router.put("/like/:id", increaseLike);
// Create Blog route
router.post("/", createBlog);
// Update Blog route
router.put("/", updateBlog);
// Delete Blog route
router.delete("/", deleteBlog);

module.exports = router;
