const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Google Auth
const SCOPES = ["https://www.googleapis.com/auth/cloud-platform"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "client_secret.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
	try {
		const content = await fs.readFile(TOKEN_PATH);
		const credentials = JSON.parse(content);
		return google.auth.fromJSON(credentials);
	} catch (err) {
		return null;
	}
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
	const content = await fs.readFile(CREDENTIALS_PATH);
	const keys = JSON.parse(content);
	const key = keys.installed || keys.web;
	const payload = JSON.stringify({
		type: "authorized_user",
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	});
	await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	let client = await loadSavedCredentialsIfExist();
	if (client) {
		return client;
	}
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	});
	if (client.credentials) {
		await saveCredentials(client);
	}
	return client;
}

/**
 * Get response from Google Generative AI
 *
 * @param {OAuth2Client} authClient
 * @param {string} userInput
 * @param {string} modelId
 * @return {Promise<string>}
 */
async function getGoogleGenerativeAIResponse(authClient, userInput, modelId) {
	const genAI = new GoogleGenerativeAI("AIzaSyDoTho7YlZYCCmAqCzHmzp8YTAgUknI6zY");
	const model = genAI.getGenerativeModel({ model: modelId });
	const prompt = userInput;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = await response.text();

	return text;
}

const parseResponse = (responseText) => {
	// Extract title and content from the response
	const titleMatch = responseText.match(/\*\*(.*?)\*\*/);
	const title = titleMatch ? titleMatch[1] : "No title found";
	const content = responseText.replace(/\*\*.*?\*\*\n\n/, ""); // Remove the title from the content

	return { title, content };
};

const sendBlogMessage = async (req, res) => {
	const { userInput } = req.body;

	try {
		const authClient = await authorize();
		const botResponse = await getGoogleGenerativeAIResponse(authClient, userInput, "gemini-pro");
		const { title, content } = parseResponse(botResponse);
		return res.status(200).json({ title, content });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const sendLungBloodMessage = async (req, res) => {
	const { userInput } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const authClient = await authorize();
		const botResponse = await getGoogleGenerativeAIResponse(
			authClient,
			userInput,
			"tunedModels/lungblooggemini-peephti5963b"
		);
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const sendCancerMessage = async (req, res) => {
	const { userInput } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const authClient = await authorize();
		const botResponse = await getGoogleGenerativeAIResponse(
			authClient,
			userInput,
			"tunedModels/cancergemini-p7ugmd1q1pz4"
		);
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const sendMentalMessage = async (req, res) => {
	const { userInput } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const authClient = await authorize();
		const botResponse = await getGoogleGenerativeAIResponse(
			authClient,
			userInput,
			"gemini-pro/tunedModels/mentalgemini-kfxvccg5w6a8"
		);
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

const sendMessage = async (req, res) => {
	const { userInput, modelId } = req.body;

	if (!userInput.trim()) {
		return res.status(400).json({ message: "User input is required" });
	}

	try {
		const authClient = await authorize();
		const botResponse = await getGoogleGenerativeAIResponse(authClient, userInput, modelId);
		return res.status(200).json({ message: botResponse });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

module.exports = { sendLungBloodMessage, sendCancerMessage, sendMentalMessage, sendBlogMessage, sendMessage };
