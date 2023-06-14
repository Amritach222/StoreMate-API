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
  isEmailVerified: {
    type: Boolean,
    default: false,
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
    default: "customer",
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
      message: "Passwords do not much. Try Again!",
    },
  },
  //email verification token
  accountVerificationToken: String,
  tokenExpiryDate: String,
  //password fields
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
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
