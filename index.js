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
const app = express();
const doctorRoutes = require("./routes/doctor.route");
//dotenv conffig
dotenv.config();
//Port
const PORT = process.env.PORT || 5000;
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
// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/health/bmi", bmiRoutes);
app.use("/api/health/glucose", glucoseRoutes);
app.use("/api/health/bloodPressure", bloodPressureRoutes);
app.use("/api/health/overall", healthRoutes);
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
