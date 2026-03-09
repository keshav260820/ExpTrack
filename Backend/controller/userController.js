import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const filePath = path.join(process.cwd(), 'users.json');

const readUsers = () => {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
};

const saveUsers = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const users = readUsers();

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now(), 
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "Passenger"
        };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ message: "User registered in JSON!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful!", user: { email: user.email, firstName: user.firstName } });
};