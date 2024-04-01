const { db } = require("../database/config");

const createUser = async (userData) => {
	await db.collection("users").doc(userData.email).set(userData);
};

const findUserByEmail = async (email) => {
	const { db } = getfirebaseApp();
	// Find user by email in Firestore
	const userDoc = await db.collection("users").doc(email).get();
	return userDoc.exists ? userDoc.data() : null;
};

module.exports = {
	createUser,
	findUserByEmail,
};
