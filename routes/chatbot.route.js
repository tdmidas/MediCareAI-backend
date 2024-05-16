const express = require("express");
const router = express.Router();
const {
	sendCancerMessage,
	sendLungBloodMessage,
	sendMentalMessage,
	sendMessage,
} = require("../controllers/chatbot.controller");

router.post("/message", sendMessage);
router.post("/message/cancer", sendCancerMessage);
router.post("/message/lungblood", sendLungBloodMessage);
router.post("/message/mental", sendMentalMessage);
module.exports = router;
