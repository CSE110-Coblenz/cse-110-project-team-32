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

    // Bind Start Game button
    const startBtn = this.view.getGroup().findOne(".startGameButton");
    if (startBtn) {
      startBtn.on("click", () => this.startGame());
    } else {
      console.warn("StartGameButton not found!");
    }
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

    if (isNaN(answerNum)) {
      console.log("Invalid input!");
      return;
    }

    const correct = this.model.checkAnswer(answerNum);

    if (correct) {
      console.log("Correct!");
      this.view.updateCorrect(this.model.getTotalCorrect());
    } else {
      console.log("Wrong!");
    }

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