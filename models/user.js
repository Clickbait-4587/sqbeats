//const Joi = require("joi");
//const mongoose = require("mongoose");
//
//const User = mongoose.model(
//  "User",
//  new mongoose.Schema({
//    name: {
//      type: String,
//      required: true,
//      minlength: 5,
//      maxlength: 50,
//    },
//    email: {
//      type: String,
//      required: true,
//      minlength: 5,
//      maxlength: 255,
//      unique: true,
//    },
//    password: {
//      type: String,
//      required: true,
//      minlength: 5,
//      maxlength: 1024,
//    },
//  })
//);
//
//function validateUser(user) {
//  const schema = {
//    name: Joi.string().min(5).max(50).required(),
//    email: Joi.string().min(5).max(255).required().email(),
//    password: Joi.string().min(5).max(255).required(),
//  };
//
//  const validation = schema.validate(req.body);
//
//  return validation;
//}
//
//exports.User = User;
//exports.validate = validateUser;
//
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  songs: Object,
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
