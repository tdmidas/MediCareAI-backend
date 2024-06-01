const { doc, setDoc, collection, getDoc, getDocs, updateDoc, deleteDoc } = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");
const userSchema = require("../schema/user.schema");
const profileSchema = require("../schema/profile.schema");
const { db } = require("../database/config");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
	const { error } = userSchema.validate(req.body);

	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}

	const userId = uuidv4();
	const newUser = {
		userId,
		...req.body,
	};

	await setDoc(doc(db, "users", userId), newUser);

	res.status(201).json(newUser);
};
const updatePassword = async (req, res) => {
	const userId = req.params.id;
	const { oldPassword, newPassword } = req.body;

	const userDoc = doc(db, "users", userId);
	const userSnapshot = await getDoc(userDoc);

	if (!userSnapshot.exists()) {
		return res.status(400).json({ message: "User not found" });
	}

	const user = userSnapshot.data();

	if (!user || !user.password) {
		return res.status(400).json({ message: "No password set for this user" });
	}

	// Validate old password if provided
	if (oldPassword) {
		const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordValid) {
			return res.status(400).json({ message: "Old password is incorrect" });
		}
	}

	// Hash the new password if provided
	if (newPassword) {
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await updateDoc(userDoc, { password: hashedPassword });
	}

	res.status(200).json({ message: "Password updated successfully" });
};

const getAllUsers = async (req, res) => {
	const querySnapshot = await getDocs(collection(db, "users"));
	const users = [];

	querySnapshot.forEach((doc) => {
		users.push(doc.data());
	});

	res.status(200).json(users);
};

const getUserById = async (req, res) => {
	const userId = req.params.id;
	const userDoc = await getDoc(doc(db, "users", userId));

	if (!userDoc.exists()) {
		return res.status(404).json({ message: "User not found" });
	}

	res.status(200).json(userDoc.data());
};
const updateUser = async (req, res) => {
	const { error } = userSchema.validate(req.body);

	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}

	const userId = req.params.id;
	const userDoc = doc(db, "users", userId);

	const userSnapshot = await getDoc(userDoc);

	if (!userSnapshot.exists()) {
		return res.status(404).json({ message: "User not found" });
	}

	await updateDoc(userDoc, req.body);

	const updatedUserDoc = await getDoc(userDoc);

	res.status(200).json(updatedUserDoc.data());
};
const updateProfile = async (req, res) => {
	const userId = req.params.id;
	const userDoc = doc(db, "users", userId);

	const userSnapshot = await getDoc(userDoc);

	if (!userSnapshot.exists()) {
		return res.status(404).json({ message: "User not found" });
	}

	try {
		await updateDoc(userDoc, req.body);
		const updatedUserDoc = await getDoc(userDoc);
		res.status(200).json(updatedUserDoc.data());
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const deleteUser = async (req, res) => {
	const userId = req.params.id;
	const userDoc = doc(db, "users", userId);

	const userSnapshot = await getDoc(userDoc);

	if (!userSnapshot.exists()) {
		return res.status(404).json({ message: "User not found" });
	}

	await deleteDoc(userDoc);

	res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
	createUser,
	getAllUsers,
	getUserById,
	updateProfile,
	deleteUser,
	updateUser,
	updatePassword,
};
