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
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/", authenticate, authorize, createUser);
router.get("/", authenticate, authorize, getAllUsers);
router.get("/:id", authenticate, authorize, getUserById);
router.put("/:id", authenticate, updateUser);
router.put("/update-password/:id", authenticate, updatePassword);
router.put("/update-profile/:id", authenticate, updateProfile);
router.delete("/:id", authenticate, authorize, deleteUser);

module.exports = router;
