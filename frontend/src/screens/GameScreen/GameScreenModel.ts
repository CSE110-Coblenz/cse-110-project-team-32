/**
 * GameScreenModel - Manages game state
 */

import type { Question } from "../../types";

export class GameScreenModel {
	private level = 3;
	private questions: Question[] = [];
	private currentQuestionIndex = 0;

	constructor(level: number = 3) {
		this.level = level;
	}

	/**
	 * Load questions for this level from the backend
	 */
	async loadQuestions(limit?: number): Promise<Question[]> {
		const res = await fetch(`http://localhost:3000/api/questions/${this.level}`);
		const data = (await res.json()) as Question[];

		// limit how many questions we take
		this.questions = limit ? data.slice(0, limit) : data;
		return this.questions;
	}

	getCurrentQuestion(): Question | null {
		return this.questions[this.currentQuestionIndex] || null;
	}

	getNextQuestion(): Question | null {
		if (this.currentQuestionIndex < this.questions.length - 1) {
			this.currentQuestionIndex++;
			return this.getCurrentQuestion();
		}
		return null;
	}

	getTotalQuestions(): number {
		return this.questions.length;
	}

    checkAnswer(answer: string): boolean {
        const current = this.getCurrentQuestion();
        if (!current) return false;
        return current.answer === answer;
    }

	getLevel(): number {
		return this.level;
	}

	reset(level?: number): void {
		this.level = level ?? 1;
		this.currentQuestionIndex = 0;
		this.questions = [];
	}
}