//Import Dependancies
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// setting up environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

//importing the app module.App.js is main entry point of your application, where you define routes, middleware, and other functionalities.
const app = require("./app");

//Database Connection URI
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//Database Connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

//   set the port on which your Node.js application should listen.
// i.e actively monitoring that port for incoming network connections. listening for incoming requests on a specific port number.
const port = process.env.PORT || 3000;

//start a server using the app module and listens on the specified port.
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
