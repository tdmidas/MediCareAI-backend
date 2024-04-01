const { auth, getEmail } = require("../database/config");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const signup = async (req, res) => {
	const { email, password } = req.body;

	try {
		await createUserWithEmailAndPassword(auth, email, password);

		return res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		console.error("Error signing up:", error);
		res.status(500).json({ message: "Error signing up" });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		await signInWithEmailAndPassword(auth, email, password);
		return res.status(200).json({ message: "Login successful" });
	} catch (error) {
		console.error("Error logging in:", error);
		res.status(500).json({ message: "Error logging in" });
	}
};

module.exports = {
	signup,
	login,
};
