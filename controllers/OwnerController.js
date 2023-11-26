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

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete({
            _id: req.params.id
        });

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            })
        };

        return res.json({
            ...deletedUser._doc,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Could not get user data"
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const updatedDoc = await UserModel.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                fullName: req.body.fullName,
                email: req.body.email,
                avatarUrl: req.body.avatarUrl,
                date: new Date()
            },
            {
                new: true
            }
        );

        if (!updatedDoc) {
            return res.status(404).json({
                message: "User not found"
            })
        };

        return res.json({
            ...updatedDoc._doc,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Could not get user data"
        })
    }
}