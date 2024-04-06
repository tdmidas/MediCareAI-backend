const express = require("express");
const router = express.Router();
const {
	createHealthData,
	getHealthDataByuserId,
	updateHealthDataByuserId,
	deleteHealthDatabyId,
} = require("../controllers/health.controller");

// Routes for handling health data
router.post("/:userId", createHealthData);
router.get("/:userId", getHealthDataByuserId);
router.put("/:userId", updateHealthDataByuserId);
router.delete("/:userId", deleteHealthDatabyId);
module.exports = router;
