import type { ScreenSwitcher } from "../../types";
import { ScreenController } from "../../types";
import { Minigame1ScreenModel } from "./Minigame1ScreenModel";
import { Minigame1ScreenView } from "./Minigame1ScreenView";
import Konva from "konva";

export class Minigame1ScreenController extends ScreenController {
  private view: Minigame1ScreenView;
  private model: Minigame1ScreenModel;
  private screenSwitcher: ScreenSwitcher;
  private timerId: any;

  constructor(screenSwitcher: ScreenSwitcher, layer: Konva.Layer) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new Minigame1ScreenModel();
    this.view = new Minigame1ScreenView(layer);
    this.view.hideFeedback();

    // Bind Start Game button
    const startBtn = this.view.getGroup().findOne(".startGameButton");
    if (startBtn) {
      startBtn.on("click", () => this.startGame());
    } else {
      console.warn("StartGameButton not found!");
    }
    this.view.onSubmit = (answer: string) => {
			this.handleAnswer(answer);
		};
  }

  // ------------------------------
  // Game Start
  // ------------------------------
  startGame() {
    this.model.reset();

    this.view.hideIntro();
    this.view.showQuestionBox();
    

    // Display first sequence
    const seq = this.model.getSequence();
    this.view.displayQuestion(seq.join(", "));

    this.startTimer();
  }

  // ------------------------------
  // Timer
  // ------------------------------
  private startTimer() {
    this.timerId = setInterval(() => {
      this.model.reduceTime();
      const timeLeft = this.model.getTimeLeft();

      this.view.updateTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(this.timerId);
        this.handleGameOver();
      }
    }, 1000);
  }

  // ------------------------------
  // Handle player answer
  // ------------------------------
  handleAnswer(userInput: string) {
    const answerNum = Number(userInput);
    console.log("handleAnswer execute");

    if (isNaN(answerNum)) {
      console.log("Invalid input!");
      return;
    }

    const correct = this.model.checkAnswer(answerNum);

    if (correct) {
      let feedbacknum = Math.random() < 0.5 ? 1 : 2;
      this.view.updateFeedback(feedbacknum);
      console.log("Correct!");
      this.view.updateCorrect(this.model.getTotalCorrect());
    } else {
      this.view.updateFeedback(0);
      console.log("Wrong!");
    }
    this.view.showFeedback();
    setTimeout(()=>this.view.hideFeedback(),1000); //hide feedback after 1s and go to next question
    // Show next question (Model auto-generated it)
    const seq = this.model.getSequence();
    this.view.displayQuestion(seq.join(", "));

  }

  // ------------------------------
  // Game Over
  // ------------------------------
  private handleGameOver() {
    console.log("⏰ GAME OVER!");
    // TODO: Show GameOver UI
  }

  getView() {
    return this.view;
  }
}