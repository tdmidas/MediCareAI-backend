const express = require("express");
const {
	createUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	updateProfile,
	updatePassword,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/update-password/:id", updatePassword);
router.put("/update-profile/:id", updateProfile);
router.delete("/:id", deleteUser);

module.exports = router;
