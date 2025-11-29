import type { Question } from "../../types"
import { EASYQ_NUM, MEDQ_NUM, HARDQ_NUM } from "../../constants"

export class Minigame2ScreenModel {
    //Fields
    private pointNum: number;
    private questionNum: number;
    public timeCounter: number | null;
    public timerId: number | null;
    public maxTime: number;
    private questions: Question[];
    private question: Question | null;
    private screen: "intro" | "pick" | "question" | "home";
    private difficulty: "easy" | "medium" | "hard" | null;

    //Constructor
    constructor() {
        this.pointNum = 0;
        this.questionNum = 0;
        this.timeCounter = null;
        this.timerId = null;
        this.maxTime = 50;
        this.questions = [];
        this.question = null;
        this.screen = "intro";
        this.difficulty = null;
    }

    //Functions manipulating this.questions
    async loadQuestions() : Promise<Question[]> {
        const res = await fetch(``);
        const data = (await res.json()) as Question[];

        this.questions = data;
        return this.questions;
    }

    //Functions manipulating pointNum
    updatePointNum() : void {
        if (this.difficulty === "easy") {
            this.pointNum++;
        } else if (this.difficulty === "medium") {
            this.pointNum += 2;
        } else if (this.difficulty === "hard") {
            this.pointNum += 3;
        } else {
            this.pointNum = 0;
        }
    }

    getPointNum() : number {
        return this.pointNum;
    }

    //Functions manipulating this.questionNum
    getQuestionNum() : number {
        return this.questionNum;
    }

    updateQuestionNum() : void {
        this.questionNum++;
    }

    //Note that all functions manipulating this.timeCounter and this.timerId are inside the controller
    //Note that this.maxTime doesn't have any functions that manipulate it as it's a constant value



    //Functions manipulating this.question
    getCurrentQuestion() : Question | null {
        return this.question || null;
    }

    updateQuestion() : void {
        try {
            if (this.difficulty === "easy") {
                let i : number = Math.floor(Math.random() * EASYQ_NUM);
                this.question = this.questions[i];
            } else if (this.difficulty === "medium") {
                let i : number = Math.floor(Math.random() * MEDQ_NUM);
                i += EASYQ_NUM;
                this.question = this.questions[i];
            } else if (this.difficulty === "hard") {
                let i : number = Math.floor(Math.random() * HARDQ_NUM);
                i += MEDQ_NUM + EASYQ_NUM;
                this.question = this.questions[i];
            } else {
                throw new Error("You haven't set the difficulty");
            }
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    //Functions manipulating this.screen
    updateScreenToContinue() : void {
        if (this.screen === "intro") {
            this.screen = "pick";
        } else if (this.screen === "pick") {
            this.screen = "question";
        } else if (this.screen === "question") {
            this.screen = "pick";
        } else {
            this.screen = "home";
        }
    }

    updateScreenToRestart() : void {
        this.screen = "intro";
    }

    updateScreenToLeave() : void {
        this.screen = "intro";
    }

    getScreen(): "intro" | "pick" | "question" | "home" {
        return this.screen;
    }

    //Functions manipulating this.difficulty
    updateDifficulty() : void {
        let i : number = Math.floor(Math.random() * 3);
        if (i <= 1) {
            this.difficulty = "easy";
        } else if (i <= 2) {
            this.difficulty = "medium";
        } else {
            this.difficulty = "hard";
        }
    }

    getDifficulty() : "easy" | "medium" | "hard" | null {
        return this.difficulty;
    }

    //General purpose functions
    checkAnswer(answer: String) : "correct" | "wrong" | "invalid" {
        const current = this.getCurrentQuestion();
        try {
            if (!current) {
                throw new Error("You haven't gotten a question yet");
            }
            if (answer.trim() === current.answer.trim()) {
                return "correct";
            } else {
                return "wrong";
            }

        } catch (err) {
            console.log("Error: ", err);
        }
        return "invalid";
    }

    resetMinigame(): void {
        this.pointNum = 0;
        this.questionNum = 0;
        this.timeCounter = null;
        this.question = null;
        this.screen = "intro";
        this.difficulty = null;
    }
}