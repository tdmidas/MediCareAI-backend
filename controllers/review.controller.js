const { db } = require("../database/config");
const { doc, setDoc, collection, arrayUnion, getDocs, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const reviewSchema = require("../schema/review.schema");
const { v4: uuidv4 } = require("uuid");
// Create a new review
const createReview = async (req, res) => {
	try {
		const { error } = reviewSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const reviewData = {
			doctorId: req.body.doctorId,
			reviewId: uuidv4(),
			userId: req.body.userId,
			displayName: req.body.displayName,
			rating: req.body.rating,
			date: new Date(),
			content: req.body.content,
		};

		const docRef = doc(db, "reviews", reviewData.reviewId);
		await setDoc(docRef, reviewData);

		res.status(201).json({ message: "Review created successfully", review: reviewData });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

const getAllReviewsDoctor = async (req, res) => {
	try {
		const doctorId = req.params.id;
		if (!doctorId) {
			return res.status(400).json({ error: "doctorId parameter is required" });
		}

		const reviews = [];
		const querySnapshot = await getDocs(collection(db, "reviews"));

		for (const docSnap of querySnapshot.docs) {
			const reviewData = docSnap.data();
			if (reviewData.doctorId === doctorId) {
				// Fetch user document to get photoURL
				const userRef = doc(db, "users", reviewData.userId);
				const userDoc = await getDoc(userRef);

				if (userDoc.exists()) {
					const photoURL = userDoc.data().photoURL;

					// Add photoURL to the reviewData
					reviews.push({
						...reviewData,
						photoURL: photoURL, // Add photoURL from user document
					});
				} else {
					// If user document not found, add reviewData without photoURL
					reviews.push(reviewData);
				}
			}
		}

		res.status(200).json(reviews);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

// Get a single review by reviewId
const getReviewById = async (req, res) => {
	try {
		const docRef = doc(db, "reviews", req.params.reviewId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			res.status(200).json(docSnap.data());
		} else {
			res.status(404).json({ error: "Review not found" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

// Update a review by reviewId
const updateReview = async (req, res) => {
	try {
		const { error } = reviewSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const reviewData = {
			doctorId: req.body.doctorId,
			userId: req.body.userId,
			displayName: req.body.displayName,
			rating: req.body.rating,
			date: req.body.date,
			content: req.body.content,
		};

		const docRef = doc(db, "reviews", req.params.reviewId);
		await updateDoc(docRef, reviewData);

		res.status(200).json({ message: "Review updated successfully", review: reviewData });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

// Delete a review by reviewId
const deleteReview = async (req, res) => {
	try {
		const docRef = doc(db, "reviews", req.params.reviewId);
		await deleteDoc(docRef);

		res.status(200).json({ message: "Review deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

module.exports = {
	createReview,
	getAllReviewsDoctor,
	getReviewById,
	updateReview,
	deleteReview,
};
