const Joi = require("joi");
const commentSchema = Joi.object({
	commentId: Joi.string().uuid().optional(),
	userId: Joi.string().optional(),
	photoURL: Joi.string().required(),
	displayName: Joi.string().required(),
	blogId: Joi.string().uuid().required(),
	content: Joi.string().required(),
});
module.exports = commentSchema;
