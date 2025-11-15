/**
 * GameScreenModel - Manages game state
 */

import type { Question } from "../../types";

export class GameScreenModel {
	private level;
	private questions: Question[] = [];
	private currentQuestionIndex = 0;
	private triesLeft = 3;

	constructor(level: number = 1) {
		this.level = level;
	}

	/**
	 * Load questions for this level from the backend
	 */
	async loadQuestions(): Promise<Question[]> {
		const regRes = await fetch(`http://localhost:3000/api/questions/${this.level}/regular`);
		const regData = (await regRes.json()) as Question[];

		const testRes = await fetch(`http://localhost:3000/api/questions/${this.level}/test`);
		const testData = (await testRes.json()) as Question | null;

		// load questions with reg questions and put test question at the end
		this.questions = testData ? [...regData, testData] : regData;
		this.currentQuestionIndex = 0;
		this.triesLeft = 3;
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

	getCurrentQuestionIndex(): number {
		return this.currentQuestionIndex;
	}

	getTotalQuestions(): number {
		return this.questions.length;
	}

	isTestQuestion(): boolean {
		const q = this.getCurrentQuestion();
		return q ? q.isTest : false;
	}

    checkAnswer(answer: string): "correct" | "wrong" | "restart" | "next" | "complete" {
		const current = this.getCurrentQuestion();
		if (!current) return "complete";

		if (answer.trim() === current.answer.trim()) {
			// right answer
			if (this.currentQuestionIndex < this.questions.length - 1) {
				this.currentQuestionIndex++;
				return "next";
			} else {
				return "complete"; // level complete
			}
		} else {
			// wrong answer
			if (this.isTestQuestion()) {
				this.triesLeft--;
				if (this.triesLeft <= 0) {
					this.currentQuestionIndex = 0;
					this.triesLeft = 3;
					return "restart";
				}
			}
			return "wrong";
		}
	}

	getLevel(): number {
		return this.level;
	}

	setLevel(level: number): void {
    	this.level = level;
	}

	reset(level: number): void {
		// TODO - we want to grab what level the user is on
		this.level = level;
		this.currentQuestionIndex = 0;
		this.questions = [];
	}
}