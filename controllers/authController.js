const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { getErrorMessage } = require("../utils/errorHandler");
const sendEmail = require("../utils/email");
const bcrypt = require('bcryptjs');
const catchAsync = require('./../utils/catchAsync');


// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

//signup user
exports.signup = catchAsync(async (req, res, next) => {
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

    // Create a verification link with the token
    const baseURL = `${req.protocol}://${req.get('host')}/api/v1`;
    const verificationLink = `${baseURL}/users/verify?token=${token}`;

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
          body {
            font-family: Arial, sans-serif;
            line-height: 1.5;
            color: #333;
          }
          .container {
            max-width: 900px;
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
        <h1>Welcome to StoreMate!</h1>
        <p>Dear ${newUser.firstname},</p>
        <p>Thank you for signing up with our platform. We're excited to have you on board!</p>
        <p>To get started, please click on the button below to verify your email address:</p>
        <a href="${verificationLink}"><button class="button">Confirm Email</button></a>
        <p>If you did not sign up for our platform, please ignore this email.</p>
        <p>Thank you again.</p>
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
    const message = 'Error!, signup operation failed!. Try again Later.';
    const errorMessage = getErrorMessage(err, message);
    res.status(500).json({
      status: 'error',
      message: errorMessage,
    });
  }
});

//verify user email
exports.verify = catchAsync(async (req, res, next) => {
  // Get the token from the request query parameters.
  const token = req.query.token;

  // Verify the token.
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);

    const userEmail= decodedToken.email;

    // Check if the user is found in the database.
    const user = await User.findOne({email: userEmail});
    // console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's email verification status in the database.
    user.isEmailVerified = true;
    await user.save();

    res.status(200).json(user);
  } catch (err) {
    const message = 'Verification Failed!.';
    const errorMessage = getErrorMessage(err, message);
    res.status(401).json({
      status: 'error',
      message: errorMessage,
    });
  }
});

//login
exports.login = catchAsync(async (req, res, next) => {
  // Get the user's credentials from the request body
  const { email, password } = req.body;

  try {
    // Retrieve the user data from the database
    const user = await User.findOne({ email }).select('+password');

    // console.log(user);

    if (!user) {
      // If the user is not found, return an error message
      return res.status(401).json({ error: 'User not Found!' });
    }

    // Compare the password provided by the user with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
          // Generate a JWT token using the user's email and a secret key
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '20m' });

    //return data
    res.json({ 
      status: 'success',
      token,
      user,
     });

    } else {
      // If the passwords do not match, return an error message
      res.status(401).json({ error: 'Invalid username or password!' });
    }
  } catch (error) {
    // Handle any errors that occur during the database operation
    // console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//logout
exports.logout = (req, res) => {
  // Set the 'jwt' cookie to 'loggedout' and configure its options
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000), // Set the cookie expiration time (in this case, 5 seconds from the current time)
    httpOnly: true, // Make the cookie accessible only through HTTP(S) requests and not by client-side JavaScript
  });

  // Send a successful response indicating that the user has been logged out
  res.status(200).json({ status: 'success' });
};


//protected
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});