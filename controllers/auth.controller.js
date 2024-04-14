const { auth, db } = require("../database/config");
const { doc, setDoc, collection, getDocs } = require("firebase/firestore");
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
			isAdmin: false,
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

		const usersCollection = collection(db, "users");
		const querySnapshot = await getDocs(usersCollection);
		let user;

		querySnapshot.forEach((doc) => {
			const userData = doc.data();
			if (userData.email === email) {
				user = userData;
				setDoc(doc.ref, { userLastlogin: new Date() }, { merge: true });
			}
		});

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		const tokenPayload = {
			userId: user.userId,
			email: user.email,
			isAdmin: user.isAdmin || false,
			// Add other user data here
		};

		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

		return res.status(200).json({ message: "Login successful", accessToken: token, userId: user.userId });
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
