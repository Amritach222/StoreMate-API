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
      accountVerificationToken: tokenData.token,
      tokenExpiryDate: tokenData.expiration,
    });

    // 3) Create a verification link :  Retrieve the base URL dynamically
    const baseURL = `${req.protocol}://${req.get("host")}`;
    const verificationLink = `${baseURL}/verify?token=${newUser.accountVerificationToken}`;

    //4) Send verification email.
    // const recipient = "bensonmakau2000@gmail.com";
    const recipient = `${newUser.email}`;
    const subject = "STOREMATE: Account Verification.";
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

//verify user email
// exports.verify = async (req, res, next) => {
//   const userEmail = req.body.email; // Retrieve email from body
//   const verificationToken = req.query.token; // Retrieve token from query parameters

//   try {
//     // Retrieve user information from the database based on the provided email
//     const user = await User.findOne({ email: userEmail });

//     if (user) {
//       const { accountVerificationToken, tokenExpiryDate } = user;

//       // Check if the parsed token matches the one stored in the database
//       if (verificationToken === accountVerificationToken) {
//         // Get the current date and time
//         const currentDate = new Date();

//         // Options for formatting the date and time
//         const options = {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//           hour: "numeric",
//           minute: "numeric",
//           timeZoneName: "short",
//         };

//         // Format the current date using the options
//         const formattedCurrentDateAndTime = currentDate.toLocaleString(
//           "en-US",
//           options
//         );
//         // const expiryDateandTime = new Date(tokenExpiryDate);
//         // const currentDateandTime = new Date(formattedCurrentDateAndTime);

//         if (formattedCurrentDateAndTime <= tokenExpiryDate) {
//           // Mark the user's email as verified in the database
//           user.isEmailVerified = true;
//           await user.save();

//           // Return success message
//           res.status(201).json({
//             status: "success",
//             message: "Email Verified Successfully",
//           });
//         } else {
//           // Token has expired
//           res.status(401).json({
//             status: "error",
//             message: "Token has expired.",
//           });
//         }
//       } else {
//         // Token does not match
//         res.status(401).json({
//           status: "error",
//           message: "Invalid token.",
//         });
//       }
//     } else {
//       // User does not exist
//       res.status(404).json({
//         status: "error",
//         message: "User does not exist.",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     const message = "Email Verification Failed, Please try again later!";
//     const errorMessage = getErrorMessage(err, message);

//     res.status(500).json({
//       status: "error",
//       message: errorMessage,
//     });
//   }
// };
