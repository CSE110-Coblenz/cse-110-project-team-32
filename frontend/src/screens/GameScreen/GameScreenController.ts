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
            // console.log("Exit button clicked");
            this.screenSwitcher.switchToScreen({ type: "home" });
			this.view.hideComplete();
        };

		this.view.onSubmit = (answer: string) => {
			this.handleAnswer(answer);
			this.view.updateProgress(
				this.model.getCurrentQuestionIndex(),
				this.model.getTotalQuestions(),
			);
		};

		this.view.onHint = () => {
			this.handleHint();
		}

	}

    /**
	 * Start the game
	 */
	async startGame() {
		this.model.reset(this.model.getLevel());
		this.view.resetProgress();
		await this.model.loadQuestions();

		const currentQuestion = this.model.getCurrentQuestion();
		this.view.updateQuestion(currentQuestion);
		this.view.updateLevel(this.model.getLevel());
		// console.log("Loaded questions:", this.model.getTotalQuestions());
		// console.log("Current question:", this.model.getCurrentQuestion());
		
		this.view.show();
	}

	handleAnswer(answer: string): void {
		const result = this.model.checkAnswer(answer);

		switch (result) {
			case "next":
				this.view.updateFeedBack(1);
				this.view.updateQuestion(this.model.getCurrentQuestion());
				this.view.updateHint("");
				break;

			case "wrong":
				this.view.updateFeedBack(0);
				break;

			case "restart":
				this.view.updateFeedBack(3);
				this.model.loadQuestions().then(() => {
					this.view.updateQuestion(this.model.getCurrentQuestion());
					this.view.updateProgress(this.model.getCurrentQuestionIndex(), this.model.getTotalQuestions(),)
				});
				break;

			case "complete":
				this.view.showComplete();
				break;
		}
		this.view.showFeedBack();
		setTimeout(()=>this.view.hideFeedBack(), 2000); //hide feedback after 2s
	}	  

	handleHint() {
		this.view.updateHint(`Hint: ${this.model.getCurrentQuestion()?.hint}` || "");
	}
	/**
	 * Get the view group
	 */
    getView(): GameScreenView {
        return this.view;
    }
}