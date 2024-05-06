const { doc, setDoc, collection, getDocs, updateDoc, deleteDoc } = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../database/config");

const createAppointment = async (req, res) => {
	try {
		const { userId, doctorId, doctorName, startTime, endTime, totalPrice, bookDate, isPaid, payMethod } = req.body;

		const appointmentData = {
			appointmentId: uuidv4(),
			userId,
			doctorId,
			doctorName,
			startTime,
			endTime,
			totalPrice,
			bookDate: new Date(),
			isPaid,
			payMethod,
			state: "incomplete",
		};

		const appointmentRef = doc(db, "appointments", appointmentData.appointmentId);
		await setDoc(appointmentRef, appointmentData);
		res.status(201).json({ message: "Appointment created successfully", appointmentData });
	} catch (error) {
		console.error("Error creating appointment:", error);
		res.status(500).json({ message: "Failed to create appointment" });
	}
};
const getMyAppointments = async (req, res) => {
	const userId = req.params.id;

	try {
		// Reference to the 'appointments' collection in Firestore
		const appointmentsRef = collection(db, "appointments");

		// Query appointments where userId matches
		const querySnapshot = await getDocs(query(collection(appointmentsRef, userId)));

		// Check if no appointments are found
		if (querySnapshot.empty) {
			return res.status(404).json({ message: "No appointments found" });
		}
		const appointments = [];

		// Iterate through each document to extract information and add to 'appointments' array
		querySnapshot.forEach((doc) => {
			const appointmentData = doc.data();
			const appointment = {
				appointmenId: doc.id,
				...appointmentData,
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

const getAllAppointments = async (req, res) => {
	try {
		// Reference to the 'appointments' collection in Firestore
		const appointmentsRef = collection(db, "appointments");

		// Get all documents from the 'appointments' collection
		const querySnapshot = await getDocs(appointmentsRef);

		// Check if no appointments are found
		if (querySnapshot.empty) {
			return res.status(404).json({ message: "No appointments found" });
		}

		// Initialize an array to store appointment information
		const appointments = [];

		// Iterate through each document to extract information and add to 'appointments' array
		querySnapshot.forEach((doc) => {
			const appointmentData = doc.data();
			const appointment = {
				appointmenId: doc.id,
				...appointmentData,
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
		const appointmentRef = doc(db, "appointments", appointmentId);

		// Get the information of the appointment document
		const docSnapshot = await getDoc(appointmentRef);

		// Check if the document exists
		if (!docSnapshot.exists()) {
			return res.status(404).json({ message: "Appointment not found" });
		}

		// Extract appointment information from the document
		const appointmentData = docSnapshot.data();
		const appointment = {
			appointmenId: docSnapshot.id,
			...appointmentData,
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
		// Reference to the appointment document with the corresponding 'appointmentId'
		const appointmentRef = doc(db, "appointments", appointmentId);

		// Update appointment information with data from request body
		await updateDoc(appointmentRef, req.body);

		// Return success message after updating the appointment
		res.status(200).json({ message: "Appointment updated successfully" });
	} catch (error) {
		// Handle errors if any occur during the process
		console.error("Error updating appointment:", error);
		res.status(500).json({ message: "Failed to update appointment" });
	}
};

const deleteAppointment = async (req, res) => {
	const appointmentId = req.params.id;

	try {
		// Reference to the appointment document with the corresponding 'appointmentId'
		const appointmentRef = doc(db, "appointments", appointmentId);

		// Delete the appointment document
		await deleteDoc(appointmentRef);

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
	getMyAppointments,
};
