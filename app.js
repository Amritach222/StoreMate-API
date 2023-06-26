//Import Dependancies
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");

//create an instance of the Express.js application.
const app = express();

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Configures the application to use the body-parser middleware to parse incoming requests with 
//URL-encoded payload. This line of code allows your Express.js application to understand and 
// process data sent from HTML forms. When a form is submitted from a web page, the data is typically 
//sent in URL-encoded format.
app.use(bodyParser.urlencoded({ extended: false }));

// parse incoming requests with JSON payload.configures middleware in an Express.js application to 
//handle incoming requests with JSON data.
app.use(bodyParser.json());

//DEFINE ROUTES
app.use("/api/v1/users", userRouter);

// exports the app variable from the current module so that it can be used in other modules.
module.exports = app;
