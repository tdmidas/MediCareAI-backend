const { db } = require("../../database/config");
const { doc, setDoc, collection, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");

// Create operation
const createBMI = async (req, res) => {
	try {
		const id = req.params.userId;
		const data = {
			userId: id,
			bmi: req.body.bmi,
			status: req.body.status,
			date: new Date(),
		};
		const bmiRef = doc(collection(db, "bmi"), id);
		await setDoc(bmiRef, data);
		res.status(201).json({ message: "BMI record created successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error creating BMI record: " + error.message });
	}
};

// Read operation
const getBMIById = async (req, res) => {
	try {
		const id = req.params.userId;
		const bmiRef = doc(collection(db, "bmi"), id);
		const bmiSnapshot = await getDoc(bmiRef);
		if (bmiSnapshot.exists()) {
			res.status(200).json(bmiSnapshot.data());
		} else {
			res.status(404).json({ message: "BMI record not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error getting BMI record: " + error.message });
	}
};

// Update operation
const updateBMI = async (req, res) => {
	try {
		const id = req.params.userId;
		const newData = req.body;
		const bmiRef = doc(collection(db, "bmi"), id);
		await updateDoc(bmiRef, newData);
		res.status(200).json({ message: "BMI record updated successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error updating BMI record: " + error.message });
	}
};

// Delete operation
const deleteBMI = async (req, res) => {
	try {
		const id = req.params.userId;
		const bmiRef = doc(collection(db, "bmi"), id);
		await deleteDoc(bmiRef);
		res.status(200).json({ message: "BMI record deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting BMI record: " + error.message });
	}
};

module.exports = {
	createBMI,
	getBMIById,
	updateBMI,
	deleteBMI,
};
