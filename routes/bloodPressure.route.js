const express = require("express");
const router = express.Router();
const {
	createBloodPressure,
	getBloodPressureById,
	updateBloodPressure,
	deleteBloodPressure,
} = require("../controllers/health/bloodPressure.controller");

// Routes for handling health data
router.post("/:userId", createBloodPressure);
router.get("/:userId", getBloodPressureById);
router.put("/:userId", updateBloodPressure);
router.delete("/:userId", deleteBloodPressure);
module.exports = router;
