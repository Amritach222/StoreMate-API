const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

exports.generateVerificationToken = function (expirationMinutes) {
  const verificationToken = uuidv4();
  const tokenExpiration = expirationMinutes;

  // Return an object with the token, status, and expiration time
  return {
    token: verificationToken,
    expiration: tokenExpiration,
  };
};

// // Token generation: Example usage: Set expiration time to 10 minutes
// const tokenData = generateVerificationToken(10);
// console.log(tokenData.token); // Access the generated token
// console.log(tokenData.status); // Access the token status
// console.log(tokenData.expiration); // Access the token expiration time
