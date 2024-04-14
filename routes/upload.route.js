const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/upload.controller");

const router = express.Router();
const upload = multer();

// Route for handling image uploads
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
