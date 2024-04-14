const express = require("express");
const router = express.Router();
const {
	createDoctor,
	getAllDoctors,
	getDoctorById,
	updateDoctor,
	deleteDoctor,
} = require("../controllers/doctor.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
// Create a new doctor
router.post("/", authenticate, authorize, createDoctor);

// Get all doctors
router.get("/", getAllDoctors);

// Get a single doctor by doctorId
router.get("/:id", authenticate, getDoctorById);

// Update a doctor by doctorId
router.put("/:id", authenticate, authorize, updateDoctor);

// Delete a doctor by doctorId
router.delete("/:id", authenticate, authorize, deleteDoctor);

module.exports = router;
