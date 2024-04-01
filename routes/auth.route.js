const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/auth.controller");

// Sign-up route
router.post("/signup", signup);

// Login route
router.post("/login", login);

module.exports = router;
