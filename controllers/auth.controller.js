const { auth, db } = require("../database/config");
const { doc, setDoc, collection, getDocs } = require("firebase/firestore");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
	const { password } = req.body;

	try {
		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);
		const id = uuid.v4();
		// Remove isAdmin from req.body if present
		const { isAdmin, ...userBody } = req.body;

		const userJson = {
			userId: id,
			displayName: userBody.name,
			email: userBody.email,
			password: hashedPassword,
			isAdmin: false,
			userLastlogin: null,
			bio: userBody.bio || "",
			photoURL:
				userBody.photoURL ||
				"https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg",
		};
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
		const usersCollection = collection(db, "users");
		const querySnapshot = await getDocs(usersCollection);
		let user;

		querySnapshot.forEach((doc) => {
			const userData = doc.data();
			if (userData.email === email && bcrypt.compareSync(password, userData.password)) {
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
		};

		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

		return res.status(200).json({
			message: "Login successful",
			accessToken: token,
			userId: user.userId,
			displayName: user.displayName,
			photoURL: user.photoURL,
			email: user.email,
		});
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
