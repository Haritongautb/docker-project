import jwt from "jsonwebtoken";
import { connectStateMsgs } from "../configMsgs/index.js";
import UserModel from "../models/User.js";


export const checkIsUser = async (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    console.log("req headers =>>>>", req.headers)
    if (token) {
        try {
            const decoded = jwt.verify(token, `${process.env.TOKEN_KEY}`);

            req.body.userID = decoded._id;
            next();

        } catch (error) {
            console.log(connectStateMsgs.errorMsg("checkAuth error =>>>>", error));
            return res.status(403).json({
                message: "No access"
            });
        }
    } else {
        return res.status(403).json({
            message: "No access"
        });
    }
};

export const checkIsOwner = async (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decoded = jwt.verify(token, `${process.env.TOKEN_KEY}`);
            req.body.userID = decoded._id;
            const user = await UserModel.findById(decoded._id);
            if (user.role === process.env.MAIN_ROLE) {
                console.log(`Your role is ${user.role}`)
                next();
            } else {
                throw new Error("No access");
            }
        } catch (error) {
            console.log(connectStateMsgs.errorMsg("checkAuth error =>>>>", error));
            return res.status(403).json({
                message: "No access"
            });
        }
    } else {
        return res.status(403).json({
            message: "No access"
        });
    }
}

export const checkIsYourAccount = async (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decoded = jwt.verify(token, `${process.env.TOKEN_KEY}`);
            const userID = jwt.verify(req.params.id, `${process.env.TOKEN_KEY}`);
            req.body.userID = decoded._id;

            const user = await UserModel.findById(decoded._id);
            if (user._id == userID._id) {
                next();
            } else {
                throw new Error("No access");
            }
        } catch (error) {
            return res.status(403).json({
                message: "No access"
            });
        }
    } else {
        return res.status(403).json({
            message: "No access"
        });
    }

}