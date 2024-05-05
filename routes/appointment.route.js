const express = require("express");
const router = express.Router();
const { createAppointment, getAllAppointments, getAppointmentById, updateAppointment, deleteAppointment} = require("../controllers/appointment.controller")

// Get all Appointments route
router.get("/getAllAppointments", getAllAppointments);
// Get appointment by Id route
router.get("/getAppointmentById", getAppointmentById);
// Create appointment route
router.post("/createAppointment", createAppointment);
// Update appointment route
router.put("/updateAppointment", updateAppointment);
// Delete appointment route
router.delete("/deleteAppointment", deleteAppointment);

module.exports = router;