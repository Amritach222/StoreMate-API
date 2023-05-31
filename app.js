const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

//create an instance of the Express.js application.
const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Configures the application to use the body-parser middleware to parse incoming requests with URL-encoded payload.
// The extended: false option specifies that the URL-encoded data should be parsed with the classic querystring library.
app.use(bodyParser.urlencoded({ extended: false }));

// parse incoming requests with JSON payload. This middleware parses the request body
// and makes it available in the req.body property of the incoming request object.
app.use(bodyParser.json());

module.exports = app;
