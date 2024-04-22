const Joi = require("joi");

const profileSchema = Joi.object({
	displayName: Joi.string().optional(),
	bio: Joi.string().optional(),
	photoURL: Joi.string().uri().optional(),
});

module.exports = profileSchema;
