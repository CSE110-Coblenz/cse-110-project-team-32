import express from "express";
import { getMiniGameTwoQuestions, getRegularQuestions, getTestQuestions } from "../controllers/question";

//Create the router that will hold all the routes that will handle the user schema
const router = express.Router();

//Create all the routes that you need to handle the user schema

// route for reg questions
router.get("/:level/regular", getRegularQuestions);
// route for test questions
router.get("/:level/test", getTestQuestions);
// route for minigame 2 questions
router.get("/:level/:limit/minigameTwo", getMiniGameTwoQuestions);

export default router;