
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch'); 
const { OAuth2Client } = require('google-auth-library');


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


const client = new OAuth2Client("173008253506-rk60rbs422nng2hvuis23addl1378k84.apps.googleusercontent.com");

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const userData = await googleRes.json();

    if (!userData.email) {
      return res.status(400).json({ success: false, message: "Google Auth Failed" });
    }

    const { name, email, picture } = userData;

    // Read your user.json file
    const data = JSON.parse(fs.readFileSync(filePath));

    // Check if user exists in the JSON array
    let user = data.users.find(u => u.email === email);

    if (!user) {
      console.log("New Google user detected. Adding to user.json...");
      
      user = {
        id: Date.now(),
        name,
        email,
        password: "", 
        role: "Passenger",
        profilePicture: picture
      };

      data.users.push(user);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }

    res.status(200).json({ success: true, message: "Login successful", user });

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};