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
            console.log("Exit button clicked");
            this.screenSwitcher.switchToScreen({ type: "home" });
        };

		this.view.onSubmit = (answer: string) => {
			this.handleAnswer(answer);
		};

	}

    /**
	 * Start the game
	 */
	async startGame() {
		this.model.reset();
		await this.model.loadQuestions(2);

		const currentQuestion = this.model.getCurrentQuestion();
		this.view.updateQuestion(currentQuestion);

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
			this.view.updateQuestion(nextQuestion);
		  } else {
			this.view.updateQuestion(null);
			// TODO: Show level completed screen
		  }
		} else {
		  // TODO: Feedback for wrong answers
		}
	  }	  

	/**
	 * Get the view group
	 */
    getView(): GameScreenView {
        return this.view;
    }
}