const { doc, setDoc, collection, getDocs, updateDoc, deleteDoc } = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../database/config");
const userSchema = require("../schema/user.schema").default;
const profileSchema = require("../schema/profile.schema").default;
const doctorSchema = require("../schema/doctor.schema").default;

const createAppointment = async (req, res) => {
    try {
        // Extract appointment information from 'req.body'
        const {
            userId,
            doctorId,
            doctorName,
            startTime,
            endTime,
            totalPrice,
            bookDate,
            isPaid,
            payMethod,
            state
        } = req.body;

        // Create an object containing appointment information
        const appointmentData = {
            userId,
            doctorId,
            doctorName,
            startTime,
            endTime,
            totalPrice,
            bookDate,
            isPaid,
            payMethod,
            state
        };

        // Add the appointment object to the 'appointments' collection in Firestore
        const appointmentRef = await db.collection("appointments").add(appointmentData);

        // Return success message and the ID of the newly created appointment
        res.status(201).json({ message: "Appointment created successfully", appointmenId: appointmentRef.id });
    } catch (error) {
        // Handle errors if any occur during the process
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Failed to create appointment" });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        // Reference to the 'appointments' collection in Firestore
        const appointmentsRef = db.collection("appointments");

        // Get a snapshot of all documents in the 'appointments' collection
        const snapshot = await appointmentsRef.get();

        // Check if no appointments are found
        if (snapshot.empty) {
            return res.status(404).json({ message: "No appointments found" });
        }

        // Initialize an array to store appointment information
        const appointments = [];

        // Iterate through each document to extract information and add to 'appointments' array
        snapshot.forEach((doc) => {
            const appointmentData = doc.data();
            const appointment = {
                appointmenId: doc.id,
                userId: appointmentData.userId,
                doctorId: appointmentData.doctorId,
                doctorName: appointmentData.doctorName,
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime,
                totalPrice: appointmentData.totalPrice,
                bookDate: appointmentData.bookDate,
                isPaid: appointmentData.isPaid,
                payMethod: appointmentData.payMethod,
                state: appointmentData.state
            };
            appointments.push(appointment);
        });

        // Return the list of appointments as JSON
        res.status(200).json(appointments);
    } catch (error) {
        // Handle errors if any occur during the process
        console.error("Error getting appointments:", error);
        res.status(500).json({ message: "Failed to get appointments" });
    }
};


const getAppointmentById = async (req, res) => {
    const appointmentId = req.params.id;

    try {
        // Reference to the appointment document with the corresponding 'appointmentId'
        const appointmentRef = db.collection("appointments").doc(appointmentId);

        // Get the information of the appointment document
        const doc = await appointmentRef.get();

        // Check if the document exists
        if (!doc.exists) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Extract appointment information from the document and create an 'appointment' object
        const appointmentData = doc.data();
        const appointment = {
            appointmenId: doc.id,
            userId: appointmentData.userId,
            doctorId: appointmentData.doctorId,
            doctorName: appointmentData.doctorName,
            startTime: appointmentData.startTime,
            endTime: appointmentData.endTime,
            totalPrice: appointmentData.totalPrice,
            bookDate: appointmentData.bookDate,
            isPaid: appointmentData.isPaid,
            payMethod: appointmentData.payMethod,
            state: appointmentData.state
        };

        // Return the appointment information as JSON
        res.status(200).json(appointment);
    } catch (error) {
        // Handle errors if any occur during the process
        console.error("Error getting appointment:", error);
        res.status(500).json({ message: "Failed to get appointment" });
    }
};

const updateAppointment = async (req, res) => {
    const appointmentId = req.params.id;

    try {
        // Check if the appointment exists
        const appointmentRef = db.collection("appointments").doc(appointmentId);
        const doc = await appointmentRef.get();

        // If appointment does not exist, return 404 error
        if (!doc.exists) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Update appointment information with data from request body
        await appointmentRef.update(req.body);

        // Retrieve updated appointment data after update
        const updatedDoc = await appointmentRef.get();
        const updatedAppointment = {
            appointmenId: updatedDoc.id,
            ...updatedDoc.data()
        };

        // Return updated appointment information as JSON response
        res.status(200).json(updatedAppointment);
    } catch (error) {
        // Handle errors if any occur during the process
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Failed to update appointment" });
    }
};

const deleteAppointment = async (req, res) => {
    const appointmentId = req.params.id;

    try {
        // Check if the appointment exists
        const appointmentRef = db.collection("appointments").doc(appointmentId);
        const doc = await appointmentRef.get();

        // If appointment does not exist, return 404 error
        if (!doc.exists) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Delete the appointment
        await appointmentRef.delete();

        // Return success message after deleting the appointment
        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        // Handle errors if any occur during the process
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Failed to delete appointment" });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
};
