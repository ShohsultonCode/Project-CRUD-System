const Joi = require('joi');

const userPostValidator = Joi.object({
    user_first_name: Joi.string().required(),
    user_last_name: Joi.string().required(),
    user_username: Joi.string().min(5).max(20).required(),
    user_email: Joi.string().email().required(),
    user_password: Joi.string().required(),
    user_job: Joi.string().required(),
    user_location_region: Joi.string().required(),
    user_location_country: Joi.string().required(),
    user_address: Joi.string().required(),
    user_description: Joi.string().required(),
    user_born: Joi.date().required(),
    user_contact: Joi.string().required(),
});


module.exports = {
    userPostValidator,
}
