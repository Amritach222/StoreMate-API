const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

// Function to send an email using cPanel email
const sendEmail = async (recipient, subject, message) => {
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
      from: process.env.SMTP_USER,
      to: recipient,
      subject: subject,
      html: `<p style="font-size: 16px; color: #333;">${message}</p>`,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};

module.exports = sendEmail;

// Example usage
// const recipient = "example@example.com";
// const subject = "Hello, World!";
// const message =
//   'This is the email content with <a href="https://www.example.com">a link</a>.';

// sendEmail(recipient, subject, message);
