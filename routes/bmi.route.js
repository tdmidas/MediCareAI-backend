const express = require("express");
const router = express.Router();
const { createBMI, getBMIById, updateBMI, deleteBMI } = require("../controllers/health/bmi.controller");

// Routes for handling health data
router.post("/:userId", createBMI);
router.get("/:userId", getBMIById);
router.put("/:userId", updateBMI);
router.delete("/:userId", deleteBMI);
module.exports = router;
