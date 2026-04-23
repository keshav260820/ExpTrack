import express from "express"; 

import { registerUser, loginUser, googleLogin } from "../controller/userController.js"; 

import { updateUser } from "../controller/updateUser.js"; 
import { deleteUser } from "../controller/deleteUser.js"; 
import { authMiddleware } from "../middlewares/authMiddleware.js"; 

const router = express.Router(); 

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.get("/me", authMiddleware, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});
router.put("/update-profile", authMiddleware, updateUser);
router.delete("/delete-user", authMiddleware, deleteUser);

export default router;