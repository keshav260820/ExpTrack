import express from "express";


const userController = require("../controller/userController.js");
const { registerUser, loginUser } = require("../controller/userController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", userController.googleLogin);

export default router;