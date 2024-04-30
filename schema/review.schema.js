const Joi = require("joi");

const reviewSchema = Joi.object({
	doctorId: Joi.string().uuid().required(),
	reviewId: Joi.string().uuid().required().optional(),
	userId: Joi.string().required(),
	displayName: Joi.string().required(),
	rating: Joi.number().min(1).max(5).required(),
	content: Joi.string().required(),
});

module.exports = reviewSchema;
