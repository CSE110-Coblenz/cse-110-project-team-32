import { ScreenController } from "../../types";
import type { ScreenSwitcher, View } from "../../types";
import { GameScreenModel } from "./GameScreenModel";
import { GameScreenView } from "./GameScreenView";

/**
 * GameScreenController - Coordinates game logic between Model and View
 */
export class GameScreenController extends ScreenController {
	private mode: "practice" | "test" = "practice";
    private model: GameScreenModel;
    private view: GameScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher, mode: "practice" | "test" = "practice") {
		super();
		this.screenSwitcher = screenSwitcher;
		this.mode = mode;

		this.model = new GameScreenModel();
		this.view = new GameScreenView();

		this.view.onExit = () => {
            // console.log("Exit button clicked");
            this.screenSwitcher.switchToScreen({ type: "home" });
			this.view.resetHint();
			this.view.hideComplete();
        };

		this.view.onSubmit = (answer: string) => {
			this.handleAnswer(answer);
		};

		this.view.onHint = () => {
			this.handleHint();
		}

	}

    /**
	 * Start the game
	 */
	async startGame(level: number) {
		this.model.setLevel(level);
		this.view.resetProgress();
		await this.model.loadQuestions();
		
		if (this.mode === "test") {
        	this.model.resetScore(); // reset score at start of test
    	}

		const currentQuestion = this.model.getCurrentQuestion();
		this.view.updateQuestion(currentQuestion);
		this.view.updateLevel(this.model.getLevel());
		// console.log("Loaded questions:", this.model.getTotalQuestions());
		// console.log("Current question:", this.model.getCurrentQuestion());
		
		this.view.show();
	}


	setLevel(levelNum: number): void {
		this.model.setLevel(levelNum);
	}

	handleAnswer(answer: string): void {
		const result = this.model.checkAnswer(answer);

		if(this.mode == "practice"){
			switch (result) {
				case "next":
					this.view.updateFeedBack(1);
					this.view.updateQuestion(this.model.getCurrentQuestion());
					this.view.updateProgress(this.model.getCurrentQuestionIndex(), this.model.getTotalQuestions());
					this.view.resetHint();
					break;

				case "wrong":
					this.view.updateFeedBack(0);
					break;

				case "restart":
					this.view.updateFeedBack(3);
					this.model.loadQuestions().then(() => {
						this.view.updateQuestion(this.model.getCurrentQuestion());
						this.view.updateProgress(this.model.getCurrentQuestionIndex(), this.model.getTotalQuestions());
					});
					this.view.resetHint();
					break;

				case "complete":
					console.log("Practice complete");
					
					// console.log(this.model.getCurrentQuestionIndex());
					// console.log(this.model.getTotalQuestions());
					this.view.updateProgress(
						this.model.getTotalQuestions(),
						this.model.getTotalQuestions(),
					);
					this.view.resetHint();
					setTimeout(()=>this.view.showComplete(), 1000);
					break;
			}
		} else if (this.mode == "test") {
			this.model.updateScore(result === "next"); 
			this.model.getNextQuestion();

			if (this.model.isTestComplete()) {
				const passed = this.model.checkIfPassed();
				this.view.showTestResults(this.model.getScorePercentage(), passed);
			} else {
				this.view.updateQuestion(this.model.getCurrentQuestion());
				this.view.updateProgress(this.model.getCurrentQuestionIndex(), this.model.getTotalQuestions());
			}
		}
		this.view.showFeedBack();
		setTimeout(()=>this.view.hideFeedBack(), 2000); //hide feedback after 2s
	}	  

	handleHint() {
		this.view.updateHint(`Hint: ${this.model.getCurrentQuestion()?.hint}`);
	}

	startTest() {
		this.mode = "test";
		this.model.resetScore();
		this.model.reset(this.model.getLevel()); // load test questions
		this.view.resetProgress();
		this.startGame(this.model.getLevel());
	}

	/**
	 * Get the view group
	 */
    getView(): GameScreenView {
        return this.view;
    }
}