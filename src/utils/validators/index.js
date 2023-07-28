const Joi = require('joi');

const userPostValidator = Joi.object({
    user_first_name: Joi.string().min(3).max(20).required(),
    user_last_name: Joi.string().min(3).max(20).required(),
    user_username: Joi.string().min(3).max(20).required(),
    user_password: Joi.string().min(3).max(20).required(),
});
const userLoginValidator = Joi.object({
    user_username: Joi.string().min(3).max(20).required(),
    user_password: Joi.string().min(1).max(30).required(),
});



const blogValidator = Joi.object({
    blog_title: Joi.string().min(5).max(35).required(),
    blog_content: Joi.string().min(5).max(555).required(),
});

const blogUpdateValidator = Joi.object({
    blog_title: Joi.string().min(5).max(35),
    blog_content: Joi.string().min(5).max(555)
});


module.exports = {
    userPostValidator,
    userLoginValidator,
    blogValidator,
    blogUpdateValidator
}
