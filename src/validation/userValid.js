const Joi = require("joi")

const userValid = Joi.object({
    Name: Joi.string().required().label("Name"),
    Email: Joi.string().required().label("Email"),
    gender: Joi.string()
    .enum("Male", "Female", "Other")
    .required()
    .label("gender"),
    Password: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)
    .required()
    .label("Password")
})
 
const loginvaild = Joi.object({
    Email :Joi.string.require().label("Email"),
    Password: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)
    .required()
    .label("Password")
})
module.exports = {userValid,loginvaild}