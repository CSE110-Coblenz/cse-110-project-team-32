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

	}

    /**
	 * Start the game
	 */
	async startGame() {
		this.model.reset(this.model.getLevel());
		this.view.resetProgress();
		await this.model.loadQuestions(6);

		const currentQuestion = this.model.getCurrentQuestion();
		this.view.updateQuestion(currentQuestion);
		this.view.updateLevel(this.model.getLevel());
		// console.log("Loaded questions:", this.model.getTotalQuestions());
		// console.log("Current question:", this.model.getCurrentQuestion());
		
		this.view.show();
	}

	async handleAnswer(userAnswer: string) {
		const isCorrect = this.model.checkAnswer(userAnswer);
		if (isCorrect) {
		  // move to next question
		  const nextQuestion = this.model.getNextQuestion();
		  if (nextQuestion) {
			this.view.updateFeedBack(1);
			this.view.updateQuestion(nextQuestion);
		  } else {
			this.view.updateQuestion(null);
			// TODO: Show level completed screen
			this.view.showComplete();
		  }
		} else {
			this.view.updateFeedBack(0);
		  // TODO: Feedback for wrong answers
		}
		this.view.showFeedBack();
		setTimeout(()=>this.view.hideFeedBack(), 2000); //hide feedback after 2s
	  }	  

	/**
	 * Get the view group
	 */
    getView(): GameScreenView {
        return this.view;
    }
}