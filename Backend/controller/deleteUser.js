import User from "../models/User.js";

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.clearCookie("token"); 

        res.status(200).json({
            success: true,
            message: "Account permanently removed from database"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};