const AWS = require("aws-sdk");

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const editBucketCORS = () => {
	const corsParams = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		CORSConfiguration: {
			CORSRules: [
				{
					AllowedHeaders: ["*"],
					AllowedMethods: ["PUT", "POST", "DELETE"],
					AllowedOrigins: ["*"],
				},
				{
					AllowedMethods: ["GET"],
					AllowedOrigins: ["*"],
				},
			],
		},
	};

	s3.putBucketCors(corsParams, (err) => {
		if (err) {
			console.error("Error editing bucket CORS:", err);
		} else {
			console.log("Edit Bucket CORS succeed!");
		}
	});
};

const uploadImage = async (req, res) => {
	try {
		const file = req.file;
		if (!file) {
			return res.status(400).send("No image uploaded.");
		}

		const params = {
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: Date.now().toString() + "-" + file.originalname,
			Body: file.buffer,
			ACL: "public-read",
		};

		await s3.upload(params).promise();

		res.send("Image uploaded successfully.");
	} catch (error) {
		console.error("Error uploading image:", error);
		res.status(500).send("Error uploading image.");
	}
};

module.exports = { uploadImage, editBucketCORS };
