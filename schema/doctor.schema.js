const Joi = require("joi");

const doctorSchema = Joi.object({
	doctorId: Joi.string().uuid().optional(),
	name: Joi.string().required(),
	speciality: Joi.string().required(),
	avgRating: Joi.number().min(0).max(5).required(),
	totalRating: Joi.number().integer().min(0).required(),
	photo: Joi.string().uri().required(),
	totalPatients: Joi.number().integer().min(0).required(),
	date: Joi.string().required(),
	education: Joi.string().required(),
	hospital: Joi.string().required(),
	short: Joi.string().required(),
	full: Joi.string().required(),
	availableTimes: Joi.array()
		.items(
			Joi.object({
				time: Joi.string().required(),
				startHour: Joi.number().integer().required(),
				endHour: Joi.number().integer().required(),
			})
		)
		.required(),
	price: Joi.number().min(0).required(),
});

module.exports = doctorSchema;
