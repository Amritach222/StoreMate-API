const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//user signup
exports.signup = async (req, res, next) => {
  try {
    //create a new user in the MongoDB database
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
    res.status(500).json({
      status: "Error!",
      message: err.message,
    });
  }
};
