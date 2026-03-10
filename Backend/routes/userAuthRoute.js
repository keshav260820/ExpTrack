import express from "express"; // 1. Import express
import { registerUser, loginUser, googleLogin } from "../controller/userController.js"; // 2. Named imports are cleaner

const router = express.Router(); // 3. Initialize the router (This is what you're missing!)

// 4. Define your routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);

export default router; // 5. Export the router