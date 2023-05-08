const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required : true,
    trim: true,
  },
  email: {
    type: String,
    required : true,
    trim: true,
    unique: true,
  },
  gender :{
    type: String,
    enum : ["Male","Female", "Other"],
    required: true,
  },
  password: {
    type: String,
    required : true,
    trim: true,
  },
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)