const express = require("express");
const router = express.Router();
const cholesterolController = require("../controllers/health/cholesterol.controller");

router.post("/:userId", cholesterolController.createCholesterolRecord);

router.get("/:userId", cholesterolController.getCholesterolById);

router.put("/:userId", cholesterolController.updateCholesterol);

router.delete("/:userId", cholesterolController.deleteCholesterol);

module.exports = router;
