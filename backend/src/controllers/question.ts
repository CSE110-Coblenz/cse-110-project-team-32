import { Request, Response } from "express";
import { getQuestionsByLevel } from "../data/question_db";

export const getQuestion = async (req: Request, res: Response) => {
    const level = Number(req.params.level);
    const questions = getQuestionsByLevel(level, 10);
    res.json(questions);
}