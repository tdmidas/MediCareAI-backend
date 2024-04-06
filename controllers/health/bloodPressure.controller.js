const { db } = require("../../database/config");
const { doc, setDoc, collection, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");

const createBloodPressure = async (req, res) => {
	try {
		const id = req.params.userId;
		const data = {
			userId: id,
			sysBP: req.body.sysBP,
			diaBP: req.body.diaBP,
			heartRate: req.body.heartRate,
			status: req.body.status,
			date: new Date(),
		};

		const bloodPressureRef = doc(collection(db, "bloodPressure"), id);
		const docSnapshot = await getDoc(bloodPressureRef);
		if (docSnapshot.exists()) {
			await updateDoc(bloodPressureRef, data);
			res.status(200).json({ message: "Blood pressure record updated successfully" });
		} else {
			await setDoc(bloodPressureRef, data);

			res.status(201).json({ message: "Blood pressure record created successfully" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error creating blood pressure record: " + error.message });
	}
};

// Read operation for Blood Pressure
const getBloodPressureById = async (req, res) => {
	try {
		const id = req.params.userId;
		const bloodPressureRef = doc(collection(db, "bloodPressure"), id);
		const bloodPressureSnapshot = await getDoc(bloodPressureRef);
		if (bloodPressureSnapshot.exists()) {
			res.status(200).json(bloodPressureSnapshot.data());
		} else {
			res.status(404).json({ message: "Blood pressure record not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error getting blood pressure record: " + error.message });
	}
};

// Update operation for Blood Pressure
const updateBloodPressure = async (req, res) => {
	try {
		const id = req.params.userId;
		const newData = req.body;
		const bloodPressureRef = doc(collection(db, "bloodPressure"), id);
		await updateDoc(bloodPressureRef, newData);
		res.status(200).json({ message: "Blood pressure record updated successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error updating blood pressure record: " + error.message });
	}
};

// Delete operation for Blood Pressure
const deleteBloodPressure = async (req, res) => {
	try {
		const id = req.params.userId;
		const bloodPressureRef = doc(collection(db, "bloodPressure"), id);
		await deleteDoc(bloodPressureRef);
		res.status(200).json({ message: "Blood pressure record deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting blood pressure record: " + error.message });
	}
};

module.exports = {
	createBloodPressure,
	getBloodPressureById,
	updateBloodPressure,
	deleteBloodPressure,
};
