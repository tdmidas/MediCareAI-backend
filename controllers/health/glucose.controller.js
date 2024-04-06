const { db } = require("../../database/config");
const { doc, setDoc, collection, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");

// Create operation for Glucose
const createGlucose = async (req, res) => {
	try {
		const id = req.params.userId;
		const data = {
			userId: id,
			glucose: req.body.glucose,
			status: req.body.status,
			date: new Date(),
		};

		// Check if the document exists
		const glucoseRef = doc(collection(db, "glucose"), id);
		const docSnapshot = await getDoc(glucoseRef);

		if (docSnapshot.exists()) {
			// If the document exists, update it
			await updateDoc(glucoseRef, data);
			res.status(200).json({ message: "Glucose record updated successfully" });
		} else {
			// If the document doesn't exist, handle the situation (e.g., create a new document)
			await setDoc(glucoseRef, data);
			res.status(201).json({ message: "Glucose record created successfully" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error updating/creating Glucose record: " + error.message });
	}
};

// Read operation for Glucose
const getGlucoseById = async (req, res) => {
	try {
		const id = req.params.userId;

		const glucoseRef = doc(collection(db, "glucose"), id);

		const glucoseSnapshot = await getDoc(glucoseRef);
		if (glucoseSnapshot.exists()) {
			res.status(200).json(glucoseSnapshot.data());
		} else {
			res.status(404).json({ message: "Glucose record not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error getting Glucose record: " + error.message });
	}
};

// Update operation for Glucose
const updateGlucose = async (req, res) => {
	try {
		const id = req.params.userId;

		const newData = req.body;
		const glucoseRef = doc(collection(db, "glucose"), id);

		await updateDoc(glucoseRef, newData);
		res.status(200).json({ message: "Glucose record updated successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error updating Glucose record: " + error.message });
	}
};

// Delete operation for Glucose
const deleteGlucose = async (req, res) => {
	try {
		const id = req.params.userId;

		const glucoseRef = doc(collection(db, "glucose"), id);

		await deleteDoc(glucoseRef);
		res.status(200).json({ message: "Glucose record deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting Glucose record: " + error.message });
	}
};

module.exports = {
	createGlucose,
	getGlucoseById,
	updateGlucose,
	deleteGlucose,
};
