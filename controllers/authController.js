const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { getErrorMessage } = require("../utils/errorHandler");
const sendEmail = require("../utils/email");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

//signup user
exports.signup = async (req, res, next) => {
  try {
    // Create a new user in the MongoDB database
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    
    // Generate a JWT token using the user's email and a secret key
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '20m' });
    
    // Update the user's verification token and token expiry time
    newUser.verificationToken = token;
    newUser.tokenExpiryTime = Date.now() + 20 * 60 * 1000; // Set token expiry time to 20 minutes

    // console.log(newUser);
    //save verificationToken and its expiryTime
    // await newUser.save();

    // Create a verification link with the token
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const verificationLink = `${baseURL}/verify?token=${token}`;

    // Prepare and send the verification email
    const recipient = newUser.email;
    const subject = 'StoreMate: Account Verification';
    const message = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to our platform</title>
        <style>
          /* Define your styles here */
        </style>
      </head>
      <body>
        <h1>Welcome to StoreMate!</h1>
        <p>Dear ${newUser.firstname},</p>
        <p>Thank you for signing up with our platform. We're excited to have you on board!</p>
        <p>To get started, please click on the button below to verify your email address:</p>
        <p><a href="${verificationLink}">Verify Email</a></p>
        <p>If you did not sign up for our platform, please ignore this email.</p>
        <p>Thank you again, and we look forward to helping you keep track of your inventory as well as sales.</p>
        <p>Sincerely,</p>
        <p>Blinx Corporation Team</p>
      </body>
      </html>`;

      //send email
    sendEmail(recipient, subject, message);

    //return data
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      },
    });
  } catch (err) {
    const message = 'Something went wrong. Signup failed. Please try again later!';
    const errorMessage = getErrorMessage(err, message);

    res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
};
