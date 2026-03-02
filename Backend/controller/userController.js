import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your JSON file
const dbPath = path.join(__dirname, '../users.json');

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Read the current users from the file
        const data = fs.readFileSync(dbPath, 'utf8');
        const users = JSON.parse(data);

        // 2. Check if user already exists
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // 3. Add the new user to the array
        const newUser = {
            id: Date.now(), // simple way to create a unique ID
            name,
            email,
            password, // In a real app, we would hash this
            role: role || "Passenger"
        };

        users.push(newUser);

        // 4. Write the updated array back to the JSON file
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error saving user data", error: error.message });
    }
};