import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.error(error);
        throw error;
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server started on port: ${process.env.PORT}`);
    });
}) 
.catch((err) => {
    console.log(err);
})









































































/*
import express from "express";
const app = express();

// Connect to MongoDB
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.error("Error connecting to MongoDB");
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error(error);
        throw error;
    }
})()

*/