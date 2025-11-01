import express from "express";
import { signup, getUser, login } from "../controllers/user";

//Create the router that will hold all the routes that will handle the user schema
const router = express.Router();

//Create all the routes that you need to handle the user schema
router.post("/newUser", signup);
router.post("/auth/login", login);
router.get("/:id", getUser);

export default router;
