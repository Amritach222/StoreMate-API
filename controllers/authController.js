const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { getErrorMessage } = require("../utils/errorHandler");
const generateVerificationToken = require("../utils/generateToken");

// // Example usage: Set expiration time to 10 minutes
// const tokenData = generateVerificationToken(10);
// console.log(tokenData.token); // Access the generated token
// console.log(tokenData.status); // Access the token status
// console.log(tokenData.expiration); // Access the token expiration time

//signup user
exports.signup = async (req, res, next) => {
  try {
    // create a new user in the MongoDB database
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // Additional actions after successful user creation
    // Send verification email, etc.

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    const message =
      "Something Went Wrong. Signup Failed, Please try again later!";
    const errorMessage = getErrorMessage(err, message);

    res.status(500).json({
      status: "error",
      message: errorMessage,
    });
  }
};
