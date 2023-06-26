const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

exports.generateVerificationToken = function (minutes) {
  const verificationToken = uuidv4();

  const expirationTime = Date.now() + 600000; // Add specified minutes (minutes * 60,000 milliseconds)


  // Return an object with the token, status, and formatted expiration time
  return {
    token: verificationToken,
    expiration: expirationTime,
  };
};

// // Token generation: Example usage: Set expiration time to 10 minutes
// const tokenData = generateVerificationToken(10);
// console.log(tokenData.token); // Access the generated token
// console.log(tokenData.status); // Access the token status
// console.log(tokenData.expiration); // Access the token expiration time
