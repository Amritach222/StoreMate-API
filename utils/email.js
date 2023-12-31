//This code will be required everytime there is need to send an email
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { getErrorMessage } = require("../utils/errorHandler");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

// Function to send an email using cPanel email
const sendEmail = async (recipient, subject, message) => {
  const senderName = process.env.SENDER_NAME;
  // Create a transporter with cPanel SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Set to true if using SSL/TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Send the email
    const info = await transporter.sendMail({
      from: `"${senderName}" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: subject,
      html: `<p style="font-size: 16px; color: #333;">${message}</p>`,
    });

    console.log("Email sent Successfully:", info.response);
  } catch (error) {
    const message = "Something Went Wrong. Email Was not Sent!";
    const errorMessage = getErrorMessage(err, message);
    console.error("Error!", errorMessage);
  }
};

module.exports = sendEmail;

// Example usage
// const recipient = "example@example.com";
// const subject = "Hello, World!";
// const message =
//   'This is the email content with <a href="https://www.example.com">a link</a>.';

// sendEmail(recipient, subject, message);
