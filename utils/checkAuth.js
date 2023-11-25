import jwt from "jsonwebtoken";
import { connectStateMsgs } from "../configMsgs/index.js";
import UserModel from "../models/User.js";


export default async (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (token) {
        try {
            const decoded = jwt.verify(token, `${process.env.TOKEN_KEY}`);

            req.body.userID = decoded._id;
            const user = await UserModel.findById(decoded._id);
            if (user.role === process.env.MAIN_ROLE || user.role === "user") {
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
};