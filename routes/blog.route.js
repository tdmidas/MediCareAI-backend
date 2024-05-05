const express = require("express");
const router = express.Router();
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require("../controllers/blog.controller")

// Get all Blog route
router.get("/getAllBlogs", getAllBlogs);
// Get Blog by Id route
router.get("/getBlogById", getBlogById);
// Create Blog route
router.post("/createBlog", createBlog);
// Update Blog route
router.put("/updateBlog", updateBlog);
// Delete Blog route
router.delete("/deleteBlog", deleteBlog);

module.exports = router;