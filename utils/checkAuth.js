import jwt from "jsonwebtoken";
import { connectStateMsgs } from "../configMsgs/index.js";

export default (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

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