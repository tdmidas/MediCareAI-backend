const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
dotenv.config();

// Configure AWS SDK
const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

// Multer-S3 configuration
const upload = multer({
	storage: multerS3({
		s3: s3Client,
		bucket: process.env.S3_BUCKET_NAME,
		contentType: multerS3.AUTO_CONTENT_TYPE,
		acl: "public-read",
		key: function (req, file, cb) {
			cb(null, file.originalname);
		},
	}),
}).single("image");

// Handle image upload
const uploadImage = (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.status(500).json({ error: err.message });
		} else {
			res.status(200).json({ message: "Image uploaded successfully", imageUrl: req.file.location });
		}
	});
};

module.exports = {
	uploadImage,
};
