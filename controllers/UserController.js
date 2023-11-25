import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import { connectStateMsgs } from "../configMsgs/index.js";


export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id
            },
            `${process.env.TOKEN_KEY}`,
            {
                expiresIn: "30d"
            }
        );

        const { passwordHash, ...userData } = user._doc;

        return res.json({
            ...userData,
            token
        });

    } catch (error) {
        console.log(connectStateMsgs.errorMsg("register error =>>>>", error))
        return res.status(500).json({
            message: "failed to register"
        });
    }
}

export const signIN = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(404).json({
                message: "Incorrect login or password"
            })
        };

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);


        if (!isValidPassword) {
            return res.status(404).json({
                message: "Incorrect login or password"
            });
        };

        const updatedToken = jwt.sign(
            {
                _id: user._id
            },
            `${process.env.TOKEN_KEY}`,
            {
                expiresIn: "30d"
            }
        );

        const { passwordHash, ...userData } = user._doc;

        return res.json({
            ...userData,
            token: updatedToken
        });

    } catch (error) {
        console.log(connectStateMsgs.errorMsg("singIN error =>>>>", error));
        return res.status(500).json({
            message: "failed to sign in"
        });
    }
}

export const getDataAboutMe = async (req, res) => {
    try {
        const user = await UserModel.findById({
            _id: req.body.userID
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const { passwordHash, ...userData } = user._doc;
        return res.json(userData);

    } catch (error) {
        console.log(connectStateMsgs.errorMsg("getDataABoutMe error =>>>>", error));
        return res.status(500).json({
            message: "No access"
        });
    }
}

export const getDataAboutAdmin = async (req, res) => {
    try {
        const user = await UserModel.findById({
            _id: req.body.userID
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const { passwordHash, ...userData } = user._doc;
        return res.json(userData);

    } catch (error) {
        console.log(connectStateMsgs.errorMsg("getDataABoutMe error =>>>>", error));
        return res.status(500).json({
            message: "No access"
        });
    }
}