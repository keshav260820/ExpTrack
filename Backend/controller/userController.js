import User from "../models/User.js";
import fetch from "node-fetch";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userId: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: newUser
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token, 
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= GOOGLE LOGIN =================
const client = new OAuth2Client("173008253506-rk60rbs422nng2hvuis23addl1378k84.apps.googleusercontent.com");

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const userData = await googleRes.json();

        if (!userData.email) {
            return res.status(400).json({
                success: false,
                message: "Google Auth Failed"
            });
        }

        const { name, email, picture } = userData;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: "",
                role: "Passenger",
                profilePicture: picture
            });
        }

        const jwtToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: jwtToken, 
            user
        });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};