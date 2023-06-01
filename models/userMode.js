const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// creates a new Mongoose schema
// In mongoDB, a schema defines the structure of documents in a collection.
// It specifies the fields and their types that a document can have,
// as well as any additional constraints, default values, or validation rules.
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please tell us your firstname!"],
  },
  lastname: {
    type: String,
    required: [true, "Please tell us your lastname!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, "any"); // Validate if it's a mobile phone number
      },
      message: "Please provide a valid phone number",
    },
  },
  role: {
    type: String,
    enum: ["customer", "employee", "owner", "admin"],
    default: "employee",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "The Passwords provided are not the same. Try Again!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
