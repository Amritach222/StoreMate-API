const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

exports.generateVerificationToken = function (minutes) {
  const verificationToken = uuidv4();

  const currentDate = new Date();
  const tokenExpiration = new Date(currentDate.getTime() + minutes * 60000); // Add specified minutes (minutes * 60,000 milliseconds)

  // Options for formatting the date and time
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  };

  // Format the expiration date using the options
  const formattedExpiration = tokenExpiration.toLocaleString("en-US", options);

  // Return an object with the token, status, and formatted expiration time
  return {
    token: verificationToken,
    expiration: formattedExpiration,
  };
};

// // Token generation: Example usage: Set expiration time to 10 minutes
// const tokenData = generateVerificationToken(10);
// console.log(tokenData.token); // Access the generated token
// console.log(tokenData.status); // Access the token status
// console.log(tokenData.expiration); // Access the token expiration time
