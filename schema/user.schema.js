const Joi = require("joi");

const userSchema = Joi.object({
	userId: Joi.string().uuid().optional(),
	displayName: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
	bio: Joi.string(),
	photoURL: Joi.string().uri(),
});

module.exports = userSchema;
