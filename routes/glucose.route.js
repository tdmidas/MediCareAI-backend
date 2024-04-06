const express = require("express");
const router = express.Router();
const {
	createGlucose,
	getGlucoseById,
	updateGlucose,
	deleteGlucose,
} = require("../controllers/health/glucose.controller");

// Routes for handling health data
router.post("/:userId", createGlucose);
router.get("/:userId", getGlucoseById);
router.put("/:userId", updateGlucose);
router.delete("/:userId", deleteGlucose);
module.exports = router;
