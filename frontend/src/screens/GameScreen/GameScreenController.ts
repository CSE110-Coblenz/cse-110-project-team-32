import { ScreenController } from "../../types";
import type { ScreenSwitcher, View } from "../../types";
import { GameScreenModel } from "./GameScreenModel";
import { GameScreenView } from "./GameScreenView";

/**
 * GameScreenController - Coordinates game logic between Model and View
 */
export class GameScreenController extends ScreenController {
    private model: GameScreenModel;
    private view: GameScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new GameScreenModel();
		this.view = new GameScreenView();

		this.view.onExit = () => {
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

		const currentQuestion = this.model.getCurrentQuestion();
		this.view.updateQuestion(currentQuestion);
		this.view.updateLevel(this.model.getLevel());
		this.view.initializeAnswer(); //clean the answerbox(it contains user and password)
		this.view.show();
	}


	setLevel(levelNum: number): void {
		this.model.setLevel(levelNum);
	}

	handleAnswer(answer: string): void {
		const result = this.model.checkAnswer(answer);
			
		switch (result) {
			case "next":
				let feedback = Math.random() < 0.5 ? 1 : 2;
				this.view.updateFeedBack(feedback);
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
				
				this.view.updateProgress(
					this.model.getTotalQuestions(),
					this.model.getTotalQuestions(),
				);
				this.view.resetHint();
				setTimeout(()=>this.view.showComplete(), 1000);
				break;
		}
		
		this.view.showFeedBack();
		setTimeout(()=>this.view.hideFeedBack(), 2000); //hide feedback after 2s
	}	  

	handleHint() {
		this.view.updateHint(`Hint: ${this.model.getCurrentQuestion()?.hint}`);
	}

	/**
	 * Get the view group
	 */
    getView(): GameScreenView {
        return this.view;
    }
}