import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import paypal from "paypal-rest-sdk";

// 
import morgan from "morgan";
import dotenv from "dotenv";
import { connectStateMsgs } from "./configMsgs/index.js";

import { UserController, OwnerController, PostController, CategoryController, ReceiptController } from "./controllers/index.js";
import { CheckAuth } from "./utils/index.js";
// import PostModel from "./models/Post.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async (response) => {
        console.log(connectStateMsgs.successMsg("DB is connected =>>>>>"));
        UserController.createOwner();
        /*         const allPosts = await PostModel.find();
                for (const post of allPosts) {
                    post.likes = 0; 
                    post.disLikes = 0; 
        
        
                    await post.save();
                }
        
                console.log('Data migration completed.'); */
    })
    .catch((error) => {
        console.log(connectStateMsgs.errorMsg("DB is Error =>>>>>", error));
    })

paypal.configure({
    "mode": process.env.PAYPAL_MODE,
    "client_id": process.env.PAYPAL_CLIENT_ID,
    "client_secret": process.env.PAYPAL_CLIENT_SECRET
});

console.log(connectStateMsgs.successMsg("PayPal configuration completed successfully."));

const app = express();

app.use(morgan(connectStateMsgs.requestMsg("Request =>>>>", 'Method - :method, URL -> :url, Status -> :status, Response -> :res[content-length] -> :response-time ms')));
app.use(express.json());

app.use(cors());


// Here are APIs

// Posts CRUD
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOnePost);
app.post("/posts", CheckAuth.checkIsUser, PostController.createPost);
app.patch("/posts/:id", CheckAuth.checkIsUser, PostController.updatePost);
app.delete("/posts/:id", CheckAuth.checkIsUser, PostController.deletePost);
// user should send something like that http://localhost:7777/posts/here is post id/like or http://localhost:7777/posts/here is post id/disLike, don't send likes or disLikes!!!!
app.patch("/posts/:id/:reaction", CheckAuth.checkIsUser, PostController.toggleReaction);
// 

// Users
app.post("/auth/register", UserController.register);
app.post("/auth/signIN", UserController.signIN);
app.get("/auth/me", CheckAuth.checkIsUser, UserController.getDataAboutMe);
app.delete("/auth/remove_account/:id", CheckAuth.checkIsUser, CheckAuth.checkIsYourAccount, UserController.removeMyAccount);
app.patch("/auth/update_my_data/:id", CheckAuth.checkIsUser, CheckAuth.checkIsYourAccount, UserController.updateMyAccount);
app.post("/users/subscribe_to_posts", CheckAuth.checkIsUser, UserController.createSubscribe);
app.get("/users/check_subscribe_is_success", CheckAuth.checkIsUser, UserController.checkIsSuccess);
// 

// Owner's CRUD
app.get("/users", CheckAuth.checkIsOwner, OwnerController.getAll);
app.post("/users", CheckAuth.checkIsOwner, UserController.register);
app.delete("/users/:id", CheckAuth.checkIsOwner, OwnerController.deleteUser);
app.patch("/users/:id", CheckAuth.checkIsOwner, OwnerController.updateUser);
// 


// Categories
app.get("/categories", CheckAuth.checkIsOwner, CategoryController.createCategories);
app.delete("/categories/delete_all", CheckAuth.checkIsOwner, CategoryController.deleteAll);
app.all("/receipts", CheckAuth.checkIsOwner, ReceiptController.handleReceipts);


// END APIs

app.listen(process.env.NODE_PORT, (error) => {
    if (error) {
        return console.log(connectStateMsgs.errorMsg("Error Server =>>>>>>>", error));
    };
    return console.log(connectStateMsgs.successMsg("Server is OK"));
})