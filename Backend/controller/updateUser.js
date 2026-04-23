import User from "../models/User.js";

export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { fullName, phoneNumber, city, bio } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $set: { 
                    name: fullName, 
                    phone: phoneNumber, 
                    city: city, 
                    bio: bio 
                } 
            },
            { new: true, runValidators: true, upsert: true } 
        ).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};