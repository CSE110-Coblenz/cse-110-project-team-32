import { Request, Response } from "express";
import { getQuestionsByLevel } from "../data/question_db";

export const getQuestion = async (req: Request, res: Response) => {
    try {
        const level = Number(req.params.level);
        const limit = Number(req.query.limit) || 10;
    
        const questions = getQuestionsByLevel(level, limit);
        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
}