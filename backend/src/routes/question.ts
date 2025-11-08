import express from "express";
import { getQuestion } from "../controllers/question";

//Create the router that will hold all the routes that will handle the user schema
const router = express.Router();

//Create all the routes that you need to handle the user schema
router.get("/:level", getQuestion);

export default router;