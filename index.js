// Import necessary modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route");
const bmiRoutes = require("./routes/bmi.route");
const glucoseRoutes = require("./routes/glucose.route");
const bloodPressureRoutes = require("./routes/bloodPressure.route");
const healthRoutes = require("./routes/health.route");
const doctorRoutes = require("./routes/doctor.route");
const userRoutes = require("./routes/user.route");
const reviewRoutes = require("./routes/review.route");
const uploadRoutes = require("./routes/upload.route");
const chatbotRoutes = require("./routes/chatbot.route");
const serverless = require("serverless-http");

// Import session middleware
const cookieSession = require("cookie-session");

// Configure session middleware
const sessionMiddleware = cookieSession({
	name: "session",
	keys: ["key1", "key2"],
	maxAge: 1 * 60 * 1000, // 1 minute
});

// App Config
const app = express();

//dotenv config
dotenv.config();

//Port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "*",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
app.use(morgan("common"));
app.use(express.json());

// Use session middleware
app.use(sessionMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/health/bmi", bmiRoutes);
app.use("/api/health/glucose", glucoseRoutes);
app.use("/api/health/bloodPressure", bloodPressureRoutes);
app.use("/api/health/overall", healthRoutes);
app.use("/api/chat", chatbotRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports.handler = serverless(app);
