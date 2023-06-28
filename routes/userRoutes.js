const express = require("express");
const authController = require("../controllers/authController");

// new instance of the Express Router
const router = express.Router();

//signup route
router.post("/signup", authController.signup);

//verify email
// router.get("/verify", authController.verify);

module.exports = router;
