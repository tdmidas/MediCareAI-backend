const { doc, setDoc, collection, getDocs, updateDoc, deleteDoc } = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../database/config");

const getAllAppointments = async (req, res) => {
	try {
		const appointmentsRef = collection(db, "appointments");
		const snapshot = await getDocs(appointmentsRef);
		const appointments = [];
		snapshot.forEach((doc) => {
			appointments.push(doc.data());
		});
		res.status(200).json(appointments);
	} catch (error) {
		console.error("Error retrieving appointments:", error);
		res.status(500).json({ message: "Failed to retrieve appointments" });
	}
};
const getMyAppointments = async (req, res) => {
	try {
		const userId = req.params.id;
		const appointmentsRef = collection(db, "appointments");
		const snapshot = await getDocs(appointmentsRef);
		const appointments = [];
		snapshot.forEach((doc) => {
			if (doc.data().userId === userId) {
				appointments.push(doc.data());
			}
		});
		res.status(200).json(appointments);
	} catch (error) {
		console.error("Error retrieving appointments:", error);
		res.status(500).json({ message: "Failed to retrieve appointments" });
	}
};
const getAppointmentById = async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const docRef = doc(db, "appointments", appointmentId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const appointmentData = { id: docSnap.id, ...docSnap.data() };
			res.status(200).json({ appointmentData });
		} else {
			res.status(404).json({ message: "Appointment not found" });
		}
	} catch (error) {
		console.error("Error retrieving appointment:", error);
		res.status(500).json({ message: "Failed to retrieve appointment" });
	}
};

const createAppointment = async (req, res) => {
	try {
		const {
			userId,
			userName,
			doctorId,
			doctorName,
			photo,
			bookDate,
			startHour,
			endHour,
			dayTime,
			totalPrice,
			isPaid,
			payMethod,
			nameOnCard,
			cardNumber,
			expiryMonth,
			expiryYear,
			cvv,
			visitType,
			address,
			note,
			diseaseDescription,
			phone,
		} = req.body;

		const appointmentData = {
			appointmentId: uuidv4(),
			userName,
			userId,
			doctorId,
			doctorName,
			photo,
			dayTime,
			startHour,
			endHour,
			totalPrice,
			bookDate,
			isPaid,
			payMethod,
			nameOnCard,
			cardNumber,
			expiryMonth,
			expiryYear,
			cvv,
			visitType,
			address,
			note,
			diseaseDescription,
			phone,
			state: "pending",
		};

		const docRef = doc(db, "appointments", appointmentData.appointmentId);
		await setDoc(docRef, appointmentData);
		res.status(201).json({ message: "Appointment created successfully", appointmentData });
	} catch (error) {
		console.error("Error creating appointment:", error);
		res.status(500).json({ message: "Failed to create appointment" });
	}
};

const updateAppointment = async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const { state } = req.body;

		const docRef = doc(db, "appointments", appointmentId);
		const updatedData = {
			state: state,
		};

		await updateDoc(docRef, updatedData);
		res.status(200).json({ message: "Appointment updated successfully" });
	} catch (error) {
		console.error("Error updating appointment:", error);
		res.status(500).json({ message: "Failed to update appointment" });
	}
};

const deleteAppointment = async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const docRef = doc(db, "appointments", appointmentId);
		await deleteDoc(docRef);
		res.status(200).json({ message: "Appointment deleted successfully" });
	} catch (error) {
		console.error("Error deleting appointment:", error);
		res.status(500).json({ message: "Failed to delete appointment" });
	}
};

module.exports = {
	createAppointment,
	getAllAppointments,
	getMyAppointments,
	getAppointmentById,
	updateAppointment,
	deleteAppointment,
};
