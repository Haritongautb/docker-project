import UserModel from "../models/User.js";

export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find().sort({ createdAt: -1 });

        return res.json(users);
    } catch (error) {
        return res.status(500).json({
            message: "Could not get user data"
        });
    }
}