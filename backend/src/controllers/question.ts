import { Request, Response } from "express";
import { getRegularQuestion, getTestQuestion } from "../data/question_db";

export const getRegularQuestions = async (req: Request, res: Response) => {
    try {
        const level = Number(req.params.level);
        const limit = Number(req.query.limit) || 5;
        const questions = getRegularQuestion(level, limit);
        res.json(questions);
    } catch (error) {
        console.error("Error fetching reg questions:", error);
        res.status(500).json({ error: "Failed to fetch regular questions" });
    }
}

export const getTestQuestions = async (req: Request, res: Response) => {
    try {
        const level = Number(req.params.level);
        const questions = getTestQuestion(level);
        res.json(questions);
    } catch (error) {
        console.error("Error fetching test questions:", error);
        res.status(500).json({ error: "Failed to fetch test questions" });
    }
}