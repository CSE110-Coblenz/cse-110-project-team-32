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
            this.model.updateScreenToContinue();
            this.startTimer();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }
        
        this.viewEntrance.onCompleteExit = () => {
            this.model.updateScreenToLeave();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        //set up all the functions for this.viewEntrance2

        this.viewEntrance2.onRandomButtonClick = () => {
            this.model.updateScreenToContinue();
            this.model.updateDifficulty();
            this.viewRoom.showRoom!(this.model.getDifficulty());
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
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

        this.viewRoom.restart = () => {
            this.model.resetMinigame();
            this.model.updateScreenToRestart();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
        }

        this.viewRoom.onPartialExit = () => {
            this.stopTimer();
            this.model.resetMinigame();
            this.model.updateScreenToRestart();
            this.screenSwitcher.switchToScreen({ type: this.model.getScreen() });
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
        this.viewEntrance2.showBackSquare();
        this.viewEntrance2.showButton1();
        this.viewEntrance2.showButton2();
        this.viewEntrance2.showButton3();
        this.viewEntrance2.showText();
        this.model.updatePointNum();
        this.model.updateQuestionNum();
    }

    startNewQuestion() {
        this.viewRoom.showBackground();
        this.model.updateQuestion();
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
            this.viewRoom.updateProgress(this.model.timeCounter, this.model.maxTime);
            if (this.model.timeCounter! >= this.model.maxTime) {
                this.stopTimer();
                this.viewRoom.showResultsBox();
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