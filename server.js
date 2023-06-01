//Import Dependancies
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Accessing environment variables using the dotenv package
dotenv.config({ path: "./config.env" });

//importing the app module.App.js is main entry point of your application, where you define routes, middleware, and other functionalities.
const app = require("./app");

//Database Connection URI
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// The default behavior of the "strictQuery" option in Mongoose,
// a MongoDB object modeling tool for Node.js, will change in version 7.
//Currently, the default is set to true, which means that Mongoose
//will only query for fields that are explicitly defined in the schema.
// However, in version 7, the default will change to false, which means
// that Mongoose will query for all fields, even those that are not explicitly
// defined in the schema. To prepare for this change, you can
// set the "strictQuery" option to false by using the code "mongoose.set('strictQuery', false);".
//If you want to keep the current behavior, you can use "mongoose.set('strictQuery', true);"
//to suppress the warning.
mongoose.set("strictQuery", false);

//Database Connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connection is Successful!"));

//   set the port on which your Node.js application should listen.
// i.e actively monitoring that port for incoming network connections. listening for incoming requests on a specific port number.
const port = process.env.PORT || 3000;

//start a server using the app module and listens on the specified port.
const server = app.listen(port, () => {
  console.log(`StoreMate App running on port ${port}...`);
});
