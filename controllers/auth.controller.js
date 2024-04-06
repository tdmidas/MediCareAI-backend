const { auth, db } = require("../database/config");
const { doc, setDoc, collection, getDoc } = require("firebase/firestore");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		await createUserWithEmailAndPassword(auth, email, password);

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const userJson = {
			userId: uuid.v4(),
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
			userLastlogin: null,
		};
		const id = req.body.email;
		const usersCollection = collection(db, "users");

		await setDoc(doc(usersCollection, id), userJson);

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

		const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "1h" });

		const usersCollection = collection(db, "users");
		const userDoc = doc(usersCollection, email);
		const userCredentials = await getDoc(userDoc);
		const id = userCredentials.data().userId;
		await setDoc(userDoc, { userLastlogin: new Date() }, { merge: true });

		return res.status(200).json({ message: "Login successful", access_token: token, userId: id });
	} catch (error) {
		if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
			return res.status(401).json({ message: "Invalid email or password" });
		} else {
			console.error("Error logging in:", error);
			return res.status(500).json({ message: "Error logging in" });
		}
	}
};

module.exports = {
	signup,
	login,
};
