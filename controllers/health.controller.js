const { db } = require("../database/config");
const { doc, setDoc, collection, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const axios = require("axios");

const predictHealthStatus = async (inputData) => {
	try {
		const response = await axios.post("http://54.254.220.173:8000/predict", {
			input: inputData,
		});
		const prediction = response.data.prediction;
		return prediction === 0 ? "Great" : "Poor";
	} catch (error) {
		console.error("Error predicting health status:", error);
		throw new Error("Failed to predict health status");
	}
};
const createHealthData = async (req, res) => {
	const userId = req.params.userId; // Assuming userId is sent in the request body
	try {
		// Fetch BMI data
		const bmiRef = doc(collection(db, "bmi"), userId);
		const bmiSnapshot = await getDoc(bmiRef);
		const bmiData = bmiSnapshot.exists() ? bmiSnapshot.data() : {};

		// Fetch glucose data
		const glucoseRef = doc(collection(db, "glucose"), userId);
		const glucoseSnapshot = await getDoc(glucoseRef);
		const glucoseData = glucoseSnapshot.exists() ? glucoseSnapshot.data() : {};

		// Fetch blood pressure data
		const bloodPressureRef = doc(collection(db, "bloodPressure"), userId);
		const bloodPressureSnapshot = await getDoc(bloodPressureRef);
		const bloodPressureData = bloodPressureSnapshot.exists() ? bloodPressureSnapshot.data() : {};

		// Fetch cholesterol data

		const cholesterolRef = doc(collection(db, "cholesterol"), userId);
		const cholesterolSnapshot = await getDoc(cholesterolRef);
		const cholesterolData = cholesterolSnapshot.exists() ? cholesterolSnapshot.data() : {};
		// Fetch user data
		const userRef = doc(collection(db, "users"), userId);
		const userSnapshot = await getDoc(userRef);
		const userData = userSnapshot.exists() ? userSnapshot.data() : {};

		// Combine all data into healthData object
		const healthData = {
			userId: userId,
			age: userData.age,
			height: bmiData.height,
			weight: bmiData.weight,
			BMI: bmiData.BMI,
			bmiStatus: bmiData.status,
			glucose: glucoseData.glucose,
			glucoseStatus: glucoseData.status,
			sysBP: bloodPressureData.sysBP,
			diaBP: bloodPressureData.diaBP,
			heartRate: bloodPressureData.heartRate,
			bloodStatus: bloodPressureData.status,
			totChol: cholesterolData.totalCholesterol,
			cholesterolStatus: cholesterolData.status,
		};

		const healthDataRef = doc(collection(db, "HealthOverall"), userId);
		await setDoc(healthDataRef, healthData);

		res.status(201).json({ message: "Health data created successfully", healthData });
	} catch (error) {
		res.status(500).json({ error: "Error creating health data: " + error.message });
	}
};

const getHealthDataByuserId = async (req, res) => {
	try {
		const userId = req.params.userId;
		const usersCollection = collection(db, "HealthOverall");
		const docRef = doc(usersCollection, userId);
		const snapshot = await getDoc(docRef);
		const {
			age,
			sysBP,
			diaBP,
			bloodStatus,
			heartRate,
			BMI,
			height,
			weight,
			bmiStatus,
			glucose,
			glucoseStatus,
			totChol,
			cholesterolStatus,
		} = snapshot.data();

		const predict = await predictHealthStatus([age, totChol, sysBP, diaBP, BMI, heartRate, glucose]);
		if (!snapshot.exists()) {
			return res.status(404).json({ message: "Health data not found for this user" });
		}
		return res.status(200).json({
			age,
			sysBP,
			diaBP,
			heartRate,
			bloodStatus,
			BMI,
			height,
			weight,
			bmiStatus,
			glucose,
			glucoseStatus,
			totChol,
			cholesterolStatus,
			predict,
		});
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch health data", error });
	}
};

const updateHealthDataByuserId = async (req, res) => {
	try {
		const userId = req.params.userId;
		const { sysBP, diaBP, heartRate, BMI, glucose } = req.body;
		const usersCollection = collection(db, "HealthOverall");
		const docRef = doc(usersCollection, userId);
		const snapshot = await getDoc(docRef);
		if (!snapshot.exists) {
			return res.status(404).json({ message: "Health data not found for this user" });
		}
		await updateDoc(snapshot.ref, {
			sysBP,
			diaBP,
			heartRate,
			BMI,
			glucose,
			tolChol,
		});
		return res.status(200).json({ message: "Health data updated successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Failed to update health data", error });
	}
};
const deleteHealthDatabyId = async (req, res) => {
	try {
		const userId = req.params.userId;
		const usersCollection = collection(db, "HealthOverall");
		const docRef = doc(usersCollection, userId);
		const snapshot = await getDoc(docRef);
		if (!snapshot.exists) {
			return res.status(404).json({ message: "Health data not found for this user" });
		}
		await deleteDoc(snapshot.ref);
		return res.status(200).json({ message: "Health data deleted successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Failed to delete health data", error });
	}
};
module.exports = {
	createHealthData,
	getHealthDataByuserId,
	updateHealthDataByuserId,
	deleteHealthDatabyId,
};
