const { db } = require("../database/config");
const { doc, setDoc, collection, getDocs, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const commentSchema = require("../schema/comment.schema");
const { v4: uuidv4 } = require("uuid");

// Create a new comment
const createComment = async (req, res) => {
	try {
		const { error } = commentSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const commentData = {
			commentId: uuidv4(),
			userId: req.body.userId,
			photoURL: req.body.photoURL,
			displayName: req.body.displayName,
			blogId: req.body.blogId,
			content: req.body.content,
		};

		const docRef = doc(db, "comments", commentData.commentId);
		await setDoc(docRef, commentData);

		res.status(201).json({ message: "Comment created successfully", comment: commentData });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

// Get all comments for a blog post
const getAllCommentsForBlog = async (req, res) => {
	try {
		const blogId = req.params.blogId;
		if (!blogId) {
			return res.status(400).json({ error: "blogId parameter is required" });
		}

		const comments = [];
		const querySnapshot = await getDocs(collection(db, "comments"));

		for (const docSnap of querySnapshot.docs) {
			const commentData = docSnap.data();
			if (commentData.blogId === blogId) {
				comments.push(commentData);
			}
		}

		res.status(200).json(comments);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

// Get a single comment by commentId
const getCommentById = async (req, res) => {
	try {
		const docRef = doc(db, "comments", req.params.commentId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			res.status(200).json(docSnap.data());
		} else {
			res.status(404).json({ error: "Comment not found" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

// Update a comment by commentId
const updateComment = async (req, res) => {
	try {
		const { error } = commentSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const commentData = {
			userId: req.body.userId || null,
			photoURL: req.body.photoURL,
			displayName: req.body.displayName,
			blogId: req.body.blogId,
			content: req.body.content,
		};

		const docRef = doc(db, "comments", req.params.commentId);
		await updateDoc(docRef, commentData);

		res.status(200).json({ message: "Comment updated successfully", comment: commentData });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

// Delete a comment by commentId
const deleteComment = async (req, res) => {
	try {
		const docRef = doc(db, "comments", req.params.commentId);
		await deleteDoc(docRef);

		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};

module.exports = {
	createComment,
	getAllCommentsForBlog,
	getCommentById,
	updateComment,
	deleteComment,
};
