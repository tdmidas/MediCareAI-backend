const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDoTho7YlZYCCmAqCzHmzp8YTAgUknI6zY");

const getGoogleGenerativeAIResponse = async (userInput) => {
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const prompt = userInput;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = await response.text();

	return text;
};

const sendMessage = async (req, res) => {
	const { userInput } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const botResponse = await getGoogleGenerativeAIResponse(userInput);
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
};
module.exports = { sendMessage };
