const {
	doc,
	setDoc,
	collection,
	getDocs,
	getDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	arrayUnion,
} = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../database/config");

const getAllBlogs = async (req, res) => {
	try {
		const { tag } = req.query; // Extract the 'tag' query parameter from the request

		let blogsRef = collection(db, "blogs");

		// If a tag query parameter is present, filter the blogs by tag
		if (tag) {
			blogsRef = query(blogsRef, where("tag", "array-contains", tag));
		}

		const snapshot = await getDocs(blogsRef);
		const blogs = [];
		snapshot.forEach((doc) => {
			blogs.push(doc.data());
		});
		res.status(200).json(blogs);
	} catch (error) {
		console.error("Error retrieving blogs:", error);
		res.status(500).json({ message: "Failed to retrieve blogs" });
	}
};

const getBlogById = async (req, res) => {
	try {
		const blogId = req.params.id;
		const docRef = doc(db, "blogs", blogId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const blogData = { id: docSnap.id, ...docSnap.data() };
			res.status(200).json({ blogData });
		} else {
			res.status(404).json({ message: "Blog not found" });
		}
	} catch (error) {
		console.error("Error retrieving blog:", error);
		res.status(500).json({ message: "Failed to retrieve blog" });
	}
};
const getMyBlogs = async (req, res) => {
	try {
		const userId = req.params.id;
		const blogsRef = collection(db, "blogs");
		const snapshot = await getDocs(blogsRef);
		const blogs = [];
		snapshot.forEach((doc) => {
			if (doc.data().userId === userId) {
				blogs.push(doc.data());
			}
		});
		res.status(200).json(blogs);
	} catch (error) {
		console.error("Error retrieving blogs:", error);
		res.status(500).json({ message: "Failed to retrieve blogs" });
	}
};
const createBlog = async (req, res) => {
	try {
		const { userId, title, photo, userPhoto, tag, content, userName } = req.body;

		const blogData = {
			blogId: uuidv4(),
			userId,
			title,
			photo,
			userName,
			userPhoto,
			tag,
			content,
			likes: 0,
			postDate: new Date(),
			state: "published",
		};
		const docRef = doc(db, "blogs", blogData.blogId);
		await setDoc(docRef, blogData);
		res.status(201).json({ message: "Blog created successfully", blogData });
	} catch (error) {
		console.error("Error creating blog:", error);
		res.status(500).json({ message: "Failed to create blog" });
	}
};

const updateBlog = async (req, res) => {
	try {
		const blogId = req.params.id;
		const { title, photo, userPhoto, tag, content, state, userName } = req.body;
		const docRef = doc(db, "blogs", blogId);
		const updatedData = {
			title,
			photo,
			userName,
			userPhoto,
			tag,
			content,
			state,
			lastUpdated: new Date(),
		};
		await updateDoc(docRef, updatedData);
		res.status(200).json({ message: "Blog updated successfully" });
	} catch (error) {
		console.error("Error updating blog:", error);
		res.status(500).json({ message: "Failed to update blog" });
	}
};

const deleteBlog = async (req, res) => {
	try {
		const blogId = req.params.id;
		const docRef = doc(db, "blogs", blogId);
		await deleteDoc(docRef);
		res.status(200).json({ message: "Blog deleted successfully" });
	} catch (error) {
		console.error("Error deleting blog:", error);
		res.status(500).json({ message: "Failed to delete blog" });
	}
};
const increaseLike = async (req, res) => {
	try {
		const blogId = req.params.id;
		const userId = req.body.userId; // Assuming userId is provided in the request body
		const blogRef = doc(db, "blogs", blogId);
		const userRef = doc(db, "users", userId);
		const blogSnap = await getDoc(blogRef);
		const userSnap = await getDoc(userRef);

		if (blogSnap.exists() && userSnap.exists()) {
			const { likes } = blogSnap.data();
			await updateDoc(blogRef, { likes: likes + 1 });

			// Update the user's likedBlogs array
			await updateDoc(userRef, { likedBlogs: arrayUnion(blogId) });

			res.status(200).json({ message: "Blog like increased and user likedBlogs updated successfully" });
		} else {
			res.status(404).json({ message: "Blog or user not found" });
		}
	} catch (error) {
		console.error("Error increasing blog like:", error);
		res.status(500).json({ message: "Failed to increase blog like" });
	}
};

module.exports = {
	getAllBlogs,
	getMyBlogs,
	getBlogById,
	createBlog,
	updateBlog,
	deleteBlog,
	increaseLike,
};
