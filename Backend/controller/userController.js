import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Define path to user.json
const filePath = path.join(__dirname, "../user.json");

// 3. Export using 'export const' instead of 'exports.'
export const registerUser = (req, res) => {
    const { name, email, password, role } = req.body;

    // Use try-catch or ensure the file exists to prevent crashes
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const existingUser = data.users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role
    };

    data.users.push(newUser);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(201).json({ message: "User registered successfully" });
};

export const loginUser = (req, res) => {
    const { email, password } = req.body;

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const user = data.users.find(
        user => user.email === email && user.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
        message: "Login successful",
        user
    });
};