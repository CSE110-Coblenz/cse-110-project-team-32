import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

//Make the environment variables inside the .env file accessable
dotenv.config();

//Set up the port and mongodb_uri which will be needed for the connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

//Set up the connection between the backend and the database
mongoose
    .connect(MONGODB_URI!)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((err) => console.error("DB connection failed: ", err));