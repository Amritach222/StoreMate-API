const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// creates a new Mongoose schema
// In mongoDB, a schema defines the structure of documents in a collection.
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation for password confirmation
        return value === this.password;
      },
      message: 'Password confirmation does not match.',
    },
  },
  verificationToken: String,
  tokenExpiryTime: String,
});

//hash password
userSchema.pre("save", async function (next) {
  // If the code has been modified, meaning the "password" field has been changed,
  // the middleware will continue executing the remaining code.
  //This typically happens when a new password is set or an existing password is updated.
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//record when password was changed
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//create a User model that serves as an interface between your application and the MongoDB database.
const User = mongoose.model("User", userSchema);

module.exports = User;
