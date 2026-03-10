const express = require("express");
const router = express.Router();

const userController = require("../controller/userController.js");
const { registerUser, loginUser } = require("../controller/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", userController.googleLogin);

module.exports = router;