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
    this.view.hideGameOver();
    this.view.hideGameWin();

    // Bind Start Game button
    const startBtn = this.view.getGroup().findOne(".startGameButton");
    if (startBtn) {
      startBtn.on("click", () => this.startGame());
    } else {
      console.warn("StartGameButton not found!");
    }
    this.view.onSubmit = (answer: string) => {
			this.handleAnswer(answer);
      this.view.updateInput();
		};
    this.view.onExit = () => {
      this.model.setGameOver();
      this.view.hideQuestionBox();
      this.view.hideGameOver();
      this.view.hideGameWin();
      this.view.showIntro();
      this.view.hideHTML();
      this.view.updateInput();
      
      clearInterval(this.timerId);
      this.screenSwitcher.switchToScreen({type: "home"});
    }
    this.view.onTryAgain = () =>{
      this.view.hideGameOver();
      this.startGame();
    }
  }

  // ------------------------------
  // Game Start
  // ------------------------------
  startGame() {

    this.model.reset();
    console.log("reseted!");
    this.view.updateTime(this.model.getTimeLeft())
    this.view.updateCorrect(this.model.getTotalCorrect());
    this.startTimer();
    this.view.hideIntro();
    this.view.showQuestionBox();
    

    // Display first sequence
    const seq = this.model.getSequence();
    this.view.displayQuestion(seq.join(", "));

    
  }


  // ------------------------------
  // Timer
  // ------------------------------
  private startTimer() {
    this.timerId = setInterval(() => {
      if(this.model.getIsGameOver()){
      return;
    }
      this.model.reduceTime();
      const timeLeft = this.model.getTimeLeft();

      this.view.updateTime(timeLeft);
      console.log("time" + timeLeft);

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
      this.model.incrementCorrect();
      this.view.updateCorrect(this.model.getTotalCorrect());
    } else {
      this.view.updateFeedback(0);
      console.log("Wrong!");
    }
    this.view.showFeedback();
    setTimeout(()=>this.view.hideFeedback(),1000); //hide feedback after 1s and go to next question
    if(this.model.getIsWin()){
      this.handleGameOver();
      console.log("game win!");
      return;
    }
    // Show next question (Model auto-generated it)
    const seq = this.model.getSequence();
    this.view.displayQuestion(seq.join(", "));

  }
  
  // ------------------------------
  // Game Over
  // ------------------------------
  private handleGameOver() {
    if(this.model.getIsWin()){
      this.view.showGameWin();
      this.model.setGameOver();
    }
    else{
      this.view.showGameOver(); //actually means game lose
      this.model.setGameOver();
      console.log("⏰ GAME OVER!");
    }
    this.view.hideHTML();
    this.view.updateInput();
  }

  getView() {
    return this.view;
  }
}
