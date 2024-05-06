const Joi = require("joi");
const commentSchema = Joi.object({
	commentId: Joi.string().uuid().required(),
	userId: Joi.string().required(),
	displayName: Joi.string().required(),
	blogId: Joi.string().uuid().required(),
	content: Joi.string().required(),
});
