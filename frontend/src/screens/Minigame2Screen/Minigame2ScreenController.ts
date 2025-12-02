import { ScreenController, type ScreenSwitcher } from "../../types"
import { Minigame2ScreenModel } from "./Minigame2ScreenModel"
import { Minigame2EntranceScreenView } from "./Minigame2ScreenViewEntrance"
import { Minigame2Entrance2ScreenView } from "./Minigame2ScreenViewEntrance2"
import { Minigame2RoomScreenView } from "./Minigame2ScreenViewRoom"

export class Minigame2ScreenController extends ScreenController {
    private model: Minigame2ScreenModel;
    private viewEntrance: Minigame2EntranceScreenView;
    private viewEntrance2: Minigame2Entrance2ScreenView;
    private viewRoom: Minigame2RoomScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.model = new Minigame2ScreenModel();
        this.viewEntrance = new Minigame2EntranceScreenView();
        this.viewEntrance2 = new Minigame2Entrance2ScreenView();
        this.viewRoom = new Minigame2RoomScreenView();
        this.screenSwitcher = screenSwitcher;

        //set up all the functions for this.viewEntrance
        this.viewEntrance.onStart = () => {
            console.log("button was clicked");
            // call this method when user selects a certain difficulty
            //this.model.loadQuestions();
            this.model.updateScreenToContinue();
            this.startTimer();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
            this.viewEntrance.hide();
        }
        
        this.viewEntrance.onCompleteExit = () => {
            this.model.updateScreenToLeave();
            this.screenSwitcher.switchToScreen({ type: "home" });
            this.viewEntrance.hide();
        }

        //set up all the functions for this.viewEntrance2

        this.viewEntrance2.onRandomButtonClick = () => {
            this.model.updateScreenToContinue();
            this.model.updateDifficulty();
            this.viewRoom.showRoom!(this.model.getDifficulty());
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        this.viewEntrance2.onBack = () => {
            // return to intro screen
            this.viewEntrance2.hide();
            this.model.updateScreenToRestart();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        // wire restart / partial exit on pick screen to same behaviors as room
        this.viewEntrance2.restart = () => {
            // hide any results modal that may be visible
            this.viewEntrance2.hideResultsBox?.();
            this.viewRoom.hideResultsBox?.();
            this.model.resetMinigame();
            this.model.updateScreenToRestart();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        this.viewEntrance2.onPartialExit = () => {
            // stop timer and hide results
            this.stopTimer();
            this.viewEntrance2.hideResultsBox?.();
            this.viewRoom.hideResultsBox?.();
            this.model.resetMinigame();
            this.model.updateScreenToRestart();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        this.viewEntrance2.onCompleteExit = () => {
            this.model.updateScreenToLeave();
            this.screenSwitcher.switchToScreen({ type: "home" });
            this.viewEntrance.hide();
        }

        //set up all the functions for this.viewRoom

        this.viewRoom.onSubmit = (answer: String) => {
            let res : String = this.model.checkAnswer(answer);
            if (res === "correct") {
                this.viewRoom.showCorrectBox();

                setTimeout(() => {
                    this.viewRoom.hideCorrectBox();
                    this.model.updateScreenToContinue();
                    this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
                    //this.screenSwitcher.switchToScreen({ type: this.model.getScreen() }); //-------Recheck this
                }, 1000);

            } else if (res === "wrong") {
                this.viewRoom.showWrongBox();

                setTimeout(() => {
                    this.viewRoom.hideWrongBox();
                }, 1000);

            } else {
                this.viewRoom.showInvalidBox();

                setTimeout(() => {
                    this.viewRoom.hideInvalidBox();
                }, 1000);
            }
        }

        // go back to pick screen from question screen
        this.viewRoom.onBack = () => {
            this.viewRoom.hide();
            // move screen state from question -> pick (timer continues)
            this.model.updateScreenToContinue();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        this.viewRoom.restart = () => {
            // hide results then reset and go back to intro
            this.viewRoom.hideResultsBox?.();
            this.viewEntrance2.hideResultsBox?.();
            this.model.resetMinigame();
            this.model.updateScreenToRestart();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        this.viewRoom.onPartialExit = () => {
            this.stopTimer();
            this.viewRoom.hideResultsBox?.();
            this.viewEntrance2.hideResultsBox?.();
            this.model.resetMinigame();
            this.model.updateScreenToRestart();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        this.viewRoom.onCompleteExit = () => {
            this.model.updateScreenToLeave();
            this.screenSwitcher.switchToScreen({ type: "home" });
            this.viewEntrance.hide();
        }
    }

    //define all the functions coming from the screenController abstract class that this
    //controller needs to implement

    getView(): Minigame2EntranceScreenView {
        return this.viewEntrance;
    }

    getView2(): Minigame2Entrance2ScreenView {
        return this.viewEntrance2;
    }

    getView3(): Minigame2RoomScreenView {
        return this.viewRoom;
    }

    show(): void {
        this.getView().show();
    }

    show2(): void {
        this.getView2().show();
    }

    show3(): void {
        this.getView3().show();
    }

    //These are all the functions that load the information for each screen
    async startMinigame2Entrance() {
        this.viewEntrance.showBackground();
        this.viewEntrance.showStartButton();
        this.viewEntrance.showInstructionBox();
        this.viewEntrance.showTitle();
        this.viewEntrance.showExitButton();
        await this.model.loadQuestions();

    }

    startMinigame2Entrance2() {
        this.viewEntrance.hide();
        this.viewEntrance2.showBackground();
        //this.viewEntrance2.showBackSquare();
        this.viewEntrance2.showButton1();
        this.viewEntrance2.showButton2();
        this.viewEntrance2.showButton3();
        this.viewEntrance2.showText();
        // show the progress bar on the pick screen and sync current progress
        this.viewEntrance2.showBar();
        this.viewEntrance2.updateProgress(this.model.timeCounter, this.model.maxTime);
        this.model.updatePointNum();
        this.model.updateQuestionNum();
    }

    startNewQuestion() {
        this.viewRoom.showBackground();
        this.model.updateQuestion();
        this.viewRoom.showQuestion(this.model.getCurrentQuestionString());
        this.viewRoom.showQuestionContainer(this.model.getCurrentQuestion());
        this.viewRoom.showBar();
        this.viewRoom.showPointNum(this.model.getPointNum());
        this.viewRoom.showQuestionNum(this.model.getQuestionNum());
    }

    //Functions manipulating the timer
    startTimer(): void {
        if (this.model.timerId !== null) {
            return;
        }
        this.model.timeCounter = 0;
        this.model.timerId = setInterval(() => {
            this.model.timeCounter!++;
            // update progress on both pick and question screens so it persists
            this.viewRoom.updateProgress(this.model.timeCounter, this.model.maxTime);
            this.viewEntrance2.updateProgress(this.model.timeCounter, this.model.maxTime);

            if (this.model.timeCounter! >= this.model.maxTime) {
                this.stopTimer();
                // show results on whichever screen is active
                const screen = this.model.getScreen();
                if (screen === "question") {
                    this.viewRoom.showResultsBox(this.model.getPointNum());
                } else if (screen === "pick") {
                    this.viewEntrance2.showResultsBox();
                } else {
                    // fallback show room results
                    this.viewRoom.showResultsBox(this.model.getPointNum());
                }
            }
        }, 1000);
    }

    stopTimer(): void {
        if (this.model.timerId === null) {
            console.error("The timerId was null");
            return;
        }
        clearInterval(this.model.timerId);
        this.model.timerId = null;
    } 
}