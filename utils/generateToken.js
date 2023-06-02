const { v4: uuidv4 } = require("uuid");

exports.generateVerificationToken = function (expirationMinutes) {
  const verificationToken = uuidv4();
  const tokenStatus = "active";
  const tokenExpiration = new Date(Date.now() + expirationMinutes * 60 * 1000);

  // Return an object with the token, status, and expiration time
  return {
    token: verificationToken,
    status: tokenStatus,
    expiration: tokenExpiration,
  };
};
