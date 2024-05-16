const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBID8PO2h5kP1YX5A7UBxfCvVErY4m3f-A");

const getGoogleGenerativeAIResponse = async (userInput, modelId) => {
	const model = genAI.getGenerativeModel({ model: modelId });
	const prompt = userInput;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = await response.text();

	return text;
};
const sendLungBloodMessage = async (req, res) => {
	const { userInput } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const botResponse = await getGoogleGenerativeAIResponse(userInput, "tunedModels/lungblooggemini-peephti5963b");
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
const sendCancerMessage = async (req, res) => {
	const { userInput } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const botResponse = await getGoogleGenerativeAIResponse(userInput, "tunedModels/cancergemini-p7ugmd1q1pz4");
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
const sendMentalMessage = async (req, res) => {
	const { userInput } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const botResponse = await getGoogleGenerativeAIResponse(
			userInput,
			"gemini-pro/tunedModels/mentalgemini-kfxvccg5w6a8"
		);
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
const sendMessage = async (req, res) => {
	const { userInput, modelId } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const botResponse = await getGoogleGenerativeAIResponse(userInput, "gemini-pro");
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};
module.exports = { sendLungBloodMessage, sendCancerMessage, sendMentalMessage, sendMessage };
