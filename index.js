import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// 
import morgan from "morgan";
import dotenv from "dotenv";
import { connectStateMsgs } from "./configMsgs/index.js";

import { UserController, OwnerController } from "./controllers/index.js";
import { CheckAuth } from "./utils/index.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async (response) => {
        console.log(connectStateMsgs.successMsg("DB is connected =>>>>>"));
    })
    .catch((error) => {
        console.log(connectStateMsgs.errorMsg("DB is Error =>>>>>", error));
    })

const app = express();

app.use(morgan(connectStateMsgs.requestMsg("Request =>>>>", 'Method - :method, URL -> :url, Status -> :status, Response -> :res[content-length] -> :response-time ms')));
app.use(express.json());

app.use(cors());


// Here are APIs

// User's CRUD Post
app.post("/auth/register", UserController.register);
app.post("/auth/signIN", UserController.signIN);
app.get("/auth/me", CheckAuth.checkIsUser, UserController.getDataAboutMe);

// 

// Owner's CRUD
app.get("/users", CheckAuth.checkIsOwner, OwnerController.getAll);
app.post("/users", CheckAuth.checkIsOwner, UserController.register);
app.delete("/users/:id", CheckAuth.checkIsOwner, OwnerController.deleteUser);
app.patch("/users/:id", CheckAuth.checkIsOwner, OwnerController.updateUser);
// 



// END APIs




app.listen(process.env.PORT, (error) => {
    if (error) {
        return console.log(connectStateMsgs.errorMsg("Error Server =>>>>>>>", error));
    };
    return console.log(connectStateMsgs.successMsg("Server is OK"));
})