const Joi = require("joi")
let enumgender = ["Male", "Female","Others"]
const userValid = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Email"),
    gender: Joi.string().valid(...enumgender)
    .required()
    .label("gender"),
    password: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)
    .required()
    .label("Password")
})
 
const loginvaild = Joi.object({
    email :Joi.string().required().label("Email"),
    password: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/)
    .required()
    .label("Password")
})
module.exports = {userValid,loginvaild}