const { db } = require("../database/config");
const { doc, setDoc, collection, getDocs, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const doctorSchema = require("../schema/doctor.schema");
const { v4: uuidv4 } = require("uuid");

const createDoctor = async (req, res) => {
	try {
		const { error, value } = doctorSchema.validate(req.body);

		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const newDoctor = {
			...value,
			doctorId: uuidv4(),
		};

		const docRef = doc(db, "doctors", newDoctor.doctorId);
		await setDoc(docRef, newDoctor);

		res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
	} catch (error) {
		res.status(500).json({ message: "Error creating doctor", error: error.message });
	}
};

const getAllDoctors = async (req, res) => {
	try {
		const doctorsCollection = collection(db, "doctors");
		const doctorsSnapshot = await getDocs(doctorsCollection);
		const doctorsList = [];

		doctorsSnapshot.forEach((doc) => {
			doctorsList.push(doc.data());
		});

		res.status(200).json(doctorsList);
	} catch (error) {
		res.status(500).json({ message: "Error getting doctors", error: error.message });
	}
};

const getDoctorById = async (req, res) => {
	try {
		const doctorId = req.params.id;
		const docRef = doc(db, "doctors", doctorId);
		const doctorSnapshot = await getDoc(docRef);

		if (doctorSnapshot.exists()) {
			const doctor = doctorSnapshot.data();
			res.status(200).json(doctor);
		} else {
			res.status(404).json({ message: "Doctor not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Error getting doctor", error: error.message });
	}
};

const updateDoctor = async (req, res) => {
	try {
		const doctorId = req.params.id;
		const updatedDoctor = req.body;

		const docRef = doc(db, "doctors", doctorId);
		await updateDoc(docRef, updatedDoctor);

		res.status(200).json({ message: "Doctor updated successfully", doctor: updatedDoctor });
	} catch (error) {
		res.status(500).json({ message: "Error updating doctor", error: error.message });
	}
};

// Delete a doctor by doctorId
const deleteDoctor = async (req, res) => {
	try {
		const doctorId = req.params.id;
		const docRef = doc(db, "doctors", doctorId);
		await deleteDoc(docRef);

		res.status(200).json({ message: "Doctor deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting doctor", error: error.message });
	}
};

module.exports = {
	createDoctor,
	getAllDoctors,
	getDoctorById,
	updateDoctor,
	deleteDoctor,
};
