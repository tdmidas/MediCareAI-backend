// session.middleware.js

const cookieSession = require("cookie-session");

// Configure session middleware
const sessionMiddleware = cookieSession({
	name: "session",
	keys: ["key1", "key2"],
	maxAge: 1 * 60 * 1000, // 10 minutes
});

module.exports = sessionMiddleware;
