import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const db = "";

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async (response) => {
        console.log("DB is OK");
    })
    .catch((error) => {
        console.log("DB is Error");
    })

const app = express();


app.use(express.json());

app.use(cors());

// Here is API
app.get("/users", async (req, res) => {
    console.log("request method =>>>>>>>", req.method);
    return res.status(500).json({
        message: "You're here"
    });
})


// END API

app.listen(7777, (error) => {
    if (error) {
        return console.log(`Error Server =>>>>>>>`, error);
    };
    return console.log("Server is OK");
})