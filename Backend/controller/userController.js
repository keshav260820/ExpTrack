import { User } from "../models/userSchema.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};