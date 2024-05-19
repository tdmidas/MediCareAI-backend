const router = require("express").Router();
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
router.get("/:id", getAppointmentById);
// Get my appointments route
router.get("/my/:id", getMyAppointments);

// Create appointment route
router.post("/", createAppointment);
// Update appointment route
router.put("/:id", updateAppointment);
// Delete appointment route
router.delete("/:id", deleteAppointment);

module.exports = router;
