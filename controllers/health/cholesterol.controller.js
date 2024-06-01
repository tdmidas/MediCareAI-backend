const { db } = require("../../database/config");
const { doc, setDoc, collection, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");

const createCholesterolRecord = async (req, res) => {
	try {
		const id = req.params.userId;
		const data = {
			userId: id,
			totalCholesterol: req.body.totalCholesterol,
			hdlCholesterol: req.body.hdlCholesterol,
			ldlCholesterol: req.body.ldlCholesterol,
			status: req.body.status,
			date: new Date(),
		};

		const cholesterolRef = doc(collection(db, "cholesterol"), id);
		const docSnapshot = await getDoc(cholesterolRef);
		if (docSnapshot.exists()) {
			await updateDoc(cholesterolRef, data);
			res.status(200).json({ message: "Cholesterol record updated successfully" });
		} else {
			await setDoc(cholesterolRef, data);
			res.status(201).json({ message: "Cholesterol record created successfully" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error creating cholesterol record: " + error.message });
	}
};

// Read operation for Cholesterol
const getCholesterolById = async (req, res) => {
	try {
		const id = req.params.userId;
		const cholesterolRef = doc(collection(db, "cholesterol"), id);
		const cholesterolSnapshot = await getDoc(cholesterolRef);
		if (cholesterolSnapshot.exists()) {
			res.status(200).json(cholesterolSnapshot.data());
		} else {
			res.status(404).json({ message: "Cholesterol record not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error getting cholesterol record: " + error.message });
	}
};

// Update operation for Cholesterol
const updateCholesterol = async (req, res) => {
	try {
		const id = req.params.userId;
		const newData = req.body;
		const cholesterolRef = doc(collection(db, "cholesterol"), id);
		await updateDoc(cholesterolRef, newData);
		res.status(200).json({ message: "Cholesterol record updated successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error updating cholesterol record: " + error.message });
	}
};

// Delete operation for Cholesterol
const deleteCholesterol = async (req, res) => {
	try {
		const id = req.params.userId;
		const cholesterolRef = doc(collection(db, "cholesterol"), id);
		await deleteDoc(cholesterolRef);
		res.status(200).json({ message: "Cholesterol record deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting cholesterol record: " + error.message });
	}
};

module.exports = {
	createCholesterolRecord,
	getCholesterolById,
	updateCholesterol,
	deleteCholesterol,
};
