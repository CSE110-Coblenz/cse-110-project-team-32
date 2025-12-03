import type { Question } from "../../types"
import { EASYQ_NUM, MEDQ_NUM, HARDQ_NUM } from "../../constants"

export class Minigame2ScreenModel {
    //Fields
    private pointNum: number;
    private questionNum: number;
    public timeCounter: number | null;
    public timerId: number | null;
    public maxTime: number;
    private easyQuestions: Question[];
    private mediumQuestions: Question[];
    private hardQuestions: Question[];
    private question: Question | null;
    private questionString: String | null;
    private screen: "intro" | "pick" | "question" | "home";
    private difficulty: "easy" | "medium" | "hard" | null;

    //Constructor
    constructor() {
        this.pointNum = 0;
        this.questionNum = 0;
        this.timeCounter = null;
        this.timerId = null;
        this.maxTime = 3;
        this.easyQuestions = [];
        this.mediumQuestions = [];
        this.hardQuestions = [];
        this.question = null;
        this.questionString = null;
        this.screen = "intro";
        this.difficulty = null;
    }

    //Functions manipulating this.questions
    async loadQuestions() : Promise<void> {
        // converting difficulty into level
        let easyLevel = 1;
        let mediumLevel = 2;
        let hardLevel = 3;
        console.log("the questions are trying to be loaded");
        const res1 = await fetch(`http://localhost:3000/api/questions/${easyLevel}/${EASYQ_NUM}/minigameTwo`);
        const data1 = (await res1.json()) as Question[];

        this.easyQuestions = data1;

        const res2 = await fetch(`http://localhost:3000/api/questions/${mediumLevel}/${MEDQ_NUM}/minigameTwo`);
        const data2 = (await res2.json()) as Question[];

        this.mediumQuestions = data2;

        const res3 = await fetch(`http://localhost:3000/api/questions/${hardLevel}/${HARDQ_NUM}/minigameTwo`);
        const data3 = (await res3.json()) as Question[];


        this.hardQuestions = data3;
        // console.log(this.questions);
        return;
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
                this.question = this.easyQuestions[i];
                this.questionString = this.question.question;
            } else if (this.difficulty === "medium") {
                let i : number = Math.floor(Math.random() * MEDQ_NUM);
                this.question = this.mediumQuestions[i];
                this.questionString = this.question.question;
            } else if (this.difficulty === "hard") {
                let i : number = Math.floor(Math.random() * HARDQ_NUM);
                this.question = this.hardQuestions[i];
                this.questionString = this.question.question;
            } else {
                console.log("We haven't set the difficulty, that's the error");
                throw new Error("You haven't set the difficulty");
            }
        } catch (err) {
            console.log("An error happened in updateQuestion");
            console.error("Error: ", err);
        }
    }

    getCurrentQuestionString() : String | null {
        return this.questionString;
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
        if (i < 1) {
            this.difficulty = "easy";
        } else if (i < 2) {
            this.difficulty = "medium";
        } else {
            this.difficulty = "hard";
        }
    }

    // Explicitly set difficulty (used when player picks a button)
    /*
    setDifficulty(d: "easy" | "medium" | "hard") : void {
        this.difficulty = d;
    }
        */

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
        this.timeCounter = 0;
        this.question = null;
        this.screen = "intro";
        this.difficulty = null;
    }
}