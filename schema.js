const Joi = require('joi');

module.exports.campgroundValidationSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location : Joi.string().required()
    }).required()
})