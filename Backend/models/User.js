import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    name: String,
    email: String,
    password: String,
    role: String,
    profilePicture: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);