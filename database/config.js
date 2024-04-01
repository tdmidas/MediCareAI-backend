const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
require("dotenv").config();
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: "medicareai.firebaseapp.com",
	databaseURL: "https://medicareai-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "medicareai",
	storageBucket: "medicareai.appspot.com",
	messagingSenderId: "1071142761241",
	appId: "1:1071142761241:web:03538b5750d0f971f7cb88",
	measurementId: "G-2040YCZZTH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const getEmail = auth.currentUser?.email;

module.exports = { auth, db, getEmail };
