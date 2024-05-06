const express = require("express");
const router = express.Router();
const {
	createAppointment,
	getAllAppointments,
	getAppointmentById,
	updateAppointment,
	deleteAppointment,
	getMyAppointments,
} = require("../controllers/appointment.controller");

// Get all Appointments route
router.get("/", getAllAppointments);
// Get appointment by Id route
router.get("/", getAppointmentById);

router.get("/my/:id", getMyAppointments);

// Create appointment route
router.post("/", createAppointment);
// Update appointment route
router.put("/", updateAppointment);
// Delete appointment route
router.delete("/", deleteAppointment);

module.exports = router;
