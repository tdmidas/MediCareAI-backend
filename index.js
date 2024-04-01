const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { auth } = require("./database/config");
const authRoutes = require("./routes/auth.route");
const app = express();
//dotenv conffig
dotenv.config();
//db

//Port
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	cors({
		origin: "http://localhost:5000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);
app.use(morgan("common"));
// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
