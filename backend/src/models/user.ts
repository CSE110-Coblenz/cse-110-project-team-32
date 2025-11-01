import mongoose from "mongoose";

//Define how all user objects will look like in the databse
const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
});

export const User = mongoose.model("User", userSchema);
