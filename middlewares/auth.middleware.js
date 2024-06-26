const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(" ")[1];
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return res.status(401).json({ message: "Authorization header is missing" });
	}
	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;

		next();
	} catch (error) {
		return res.status(403).json({ message: "Invalid token" });
	}
};

const authorize = (req, res, next) => {
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	next();
};

module.exports = {
	authenticate,
	authorize,
};
