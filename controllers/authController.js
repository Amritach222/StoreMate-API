const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { getErrorMessage } = require("../utils/errorHandler");
const { generateVerificationToken } = require("../utils/generateToken");
const sendEmail = require("../utils/email");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

//signup user
exports.signup = async (req, res, next) => {
  try {
    // Call the generateVerificationToken function using the object reference and generate a verification TOKEN
    const tokenData = generateVerificationToken(process.env.tokenExpiryMinutes);

    //1) create a new user in the MongoDB database
    const newUser = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      //2) Create verification token and share to users email
      verificationToken: tokenData.token,
      tokenExpiryTime: tokenData.expiration,
    });

    // 3) Create a verification link :  Retrieve the base URL dynamically
    const baseURL = `${req.protocol}://${req.get("host")}`;
    const verificationLink = `${baseURL}/verify?token=${newUser.accountVerificationToken}`;

    //4) Send verification email.
    // const recipient = "bensonmakau2000@gmail.com";
    const recipient = `${newUser.email}`;
    const subject = "StoreMate: Account Verification.";
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to our platform</title>
      <style>
      /* Define your styles here */
      body {
        font-family: Arial, sans-serif;
        line-height: 1.5;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        color: #007bff;
      }
      p {
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
      }
      .button:hover {
        background-color: black;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to StoreMate!</h1>
        <p>Dear ${newUser.firstname}  ${newUser.lastname},</p>
        <p>Thank you for signing up with our platform. We're excited to have you on board!</p>
        <p>To get started, please click on the button below to verify your email address:</p>
        <p><a class="button" href="${verificationLink}"style="color:white;">Verify Email</a></p>
        <p>If you did not sign up for our platform, please ignore this email.</p>
        <p>Thank you again, and we look forward to helping you keep track of your inventory as well as sales.</p>
        <p>Sincerely,</p>
        <p>Blinx Corporation Team</p>
      </div>
    </body>
    </html>
  `;

    // Send Email to request verification
    sendEmail(recipient, subject, message);

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

// //verify email
// exports.verify = async (req, res, next) => {
//   const emailVerificationToken = req.body.token;
//   const emailAddress = req.body.email;

//   try {
//     const user = await User.findOne({ email: emailAddress });

//     if (!user) {
//       return res.status(400).send("User does not exist");
//     }

//     if (user.verificationToken !== emailVerificationToken) {
//       return res.status(400).send("Invalid verification token");
//     }

//     user.isEmailVerified = true;
//     await user.save();

//     return res.status(200).send("Email address verified");
//   } catch (error) {
//     return res.status(500).send("Internal server error");
//   }
// };
