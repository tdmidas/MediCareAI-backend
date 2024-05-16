const { collection, getDocs, where, query } = require("firebase/firestore");
const { db } = require("../database/config");

const search = async (req, res) => {
	const { type, query } = req.query;
	if (!type || !query) {
		return res.status(400).json({ error: "Type and query parameters are required" });
	}

	try {
		let result;
		if (type === "doctor") {
			result = await searchDoctorsByName(query);
		} else if (type === "blog") {
			result = await searchBlogsByTitle(query);
		} else {
			return res.status(400).json({ error: "Invalid type parameter" });
		}
		res.status(200).json(result);
	} catch (error) {
		console.error("Error performing search:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Function to search for doctors by name
const searchDoctorsByName = async (name) => {
	const doctorsRef = collection(db, "doctors");
	const querySnapshot = await getDocs(doctorsRef);

	const doctors = [];
	querySnapshot.forEach((doc) => {
		const doctorData = doc.data();
		const doctorName = doctorData.name.toLowerCase();
		const searchQuery = name.toLowerCase();

		// Check if any substring of the doctor's name contains the search query
		if (doctorName.includes(searchQuery)) {
			doctors.push({ id: doc.id, ...doctorData });
		}
	});

	return doctors;
};
const searchBlogsByTitle = async (title) => {
	const blogsRef = collection(db, "blogs");
	const querySnapshot = await getDocs(blogsRef);

	const blogs = [];
	querySnapshot.forEach((doc) => {
		const blogData = doc.data();
		const blogTitle = blogData.title.toLowerCase();
		const searchQuery = title.toLowerCase();

		// Check if any substring of the blog's title contains the search query
		if (blogTitle.includes(searchQuery)) {
			blogs.push({ id: doc.id, ...blogData });
		}
	});

	return blogs;
};

module.exports = {
	search,
};
