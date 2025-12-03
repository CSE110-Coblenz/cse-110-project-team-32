import Konva from "konva";
import type { View } from "../../types.ts";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class GameScreenView implements View {
	private group: Konva.Group;
    private questionText!: Konva.Text;
    private hintText!: Konva.Text;
    private answerBox!: Konva.Rect;
    private answerText!: Konva.Text;
    private currentAnswer: string = "";
    private cursor!: Konva.Rect;
    private cursorIndex: number = 0;//position of cursor
    private measureText!: Konva.Text; //measure length of answer
    private testTitle!: Konva.Text;
    private modeBox!: Konva.Rect;
    private modeText!: Konva.Text;

    private levelText!: Konva.Text;
    private questionBoxText!: Konva.Text;
    private progressBar!: Konva.Rect;
    private progressFill!: Konva.Rect;
    private feedBack!: Konva.Text;
    private feedBackBox!: Konva.Rect;
    private completeScreen!: Konva.Rect;
    private completeText!: Konva.Text;

    onSubmit?: (answer: string) => void;
    onExit?: () => void;
    onHint?: () => void;
    onReset?: () => void;

	constructor() {
		this.group = new Konva.Group({ visible: false });

		// Background
		Konva.Image.fromURL("/levelBackdrop.png", (bg: Konva.Image) => {
			// image is Konva.Image instance
			// bg.setAttrs({
            //     width: STAGE_WIDTH,
            //     height: STAGE_HEIGHT,
			// })
            bg.width(STAGE_WIDTH);
            bg.height(STAGE_HEIGHT);
			this.group.add(bg);

            // box with questions and answers should be in the middle of the screen
            const contentBox = new Konva.Rect({
                x: (STAGE_WIDTH - CONTENT_WIDTH) / 2,
                y: (STAGE_HEIGHT - CONTENT_HEIGHT) / 2,
                width: CONTENT_WIDTH,
                height: CONTENT_HEIGHT,
                fill: "#ebe8e1",
                opacity: 0.9,
                cornerRadius: 8,
            });
            this.group.add(contentBox);

            this.progressBar = new Konva.Rect({
                x: contentBox.x(),
                y: contentBox.y() + contentBox.height() - 50,
                width: CONTENT_WIDTH,
                height: 50,
                fill: 'white',
                cornerRadius: 8,
                // stroke: 'black',
                // strokeWidth: 5 
            });
            this.group.add(this.progressBar);

            this.progressFill = new Konva.Rect({
                x: (STAGE_WIDTH - CONTENT_WIDTH) / 2,
                y: this.progressBar.y(),
                width: 0,
                // width: 50, //for texting, initialize should be 0
                height: 50,
                fill: 'green',
                // stroke: 'black',
                // strokeWidth: 5
            });
            this.group.add(this.progressFill);

            // exit button top left
            const exitButtonSize = 50;

            const exitButton = new Konva.Rect({
                x: contentBox.x() + 20,
                y: contentBox.y() + 20,
                width: exitButtonSize,
                height: exitButtonSize,
                fill: "red",
                stroke: "black",
                strokeWidth: 2,
                cornerRadius: 8,
            });
            this.group.add(exitButton);

            exitButton.on("click", () => {
                if (this.onExit) this.onExit();
            });

            const exitSymbol = new Konva.Text({
                x: exitButton.x(),
                y: exitButton.y() + (exitButton.height() - 32) / 2,
                width: exitButton.width(),
                text: "X",
                fontSize: 32,
                align: "center",
                verticalAlign: "middle",
            });
            this.group.add(exitSymbol);

            exitSymbol.on("click", () => {
                if (this.onExit) this.onExit();
            });

            // reset button top left
            const resetButton = new Konva.Rect({
                x: contentBox.x() + 20,
                y: contentBox.y() + 80,
                width: exitButtonSize,
                height: exitButtonSize,
                fill: "green",
                stroke: "black",
                strokeWidth: 2,
                cornerRadius: 8,
            });
            this.group.add(resetButton);

            exitButton.on("click", () => {
                if (this.onReset) this.onReset();
            });

            const resetSymbol = new Konva.Text({
                x: resetButton.x(),
                y: resetButton.y() + (resetButton.height() - 45) / 2,
                width: resetButton.width(),
                text: "↻",
                fontSize: 40,
                align: "center",
                verticalAlign: "middle",
            });
            this.group.add(resetSymbol);

            resetSymbol.on("click", () => {
                if (this.onReset) this.onReset();
            });
            
            // level box top right
            const levelBoxWidth = 250;
            const levelBoxHeight = 50;
            
            const levelBox = new Konva.Rect({
                x: contentBox.x() + contentBox.width() - levelBoxWidth - 20,
                y: contentBox.y() + 20,
                width: levelBoxWidth,
                height: levelBoxHeight,
                fill: "#14b1d9",
                stroke: "black",
                strokeWidth: 2,
                cornerRadius: 8,
            });
            this.group.add(levelBox);
          
            this.levelText = new Konva.Text({
                x: levelBox.x(),
                y: levelBox.y() + (levelBox.height() - 32) / 2,
                width: levelBox.width(),
                text: "",
                fontSize: 32,
                align: "center",
                fill: "black",
                });
            this.group.add(this.levelText);

            // question box top right
            const questionBox = new Konva.Rect({
                x: contentBox.x() + contentBox.width() - levelBoxWidth - 20,
                y: contentBox.y() + 80,
                width: levelBoxWidth,
                height: levelBoxHeight,
                fill: "green",
                stroke: "black",
                strokeWidth: 2,
                cornerRadius: 8,
            });
            this.group.add(questionBox);
          
            this.questionBoxText = new Konva.Text({
                x: questionBox.x(),
                y: questionBox.y() + (questionBox.height() - 32) / 2,
                width: questionBox.width(),
                text: "",
                fontSize: 32,
                align: "center",
                fill: "black",
                });
            this.group.add(this.questionBoxText);
            
            // question text at the top
            this.questionText = new Konva.Text({
                x: contentBox.x() + 40,
                y: contentBox.y() + contentBox.height() / 2 - 55, 
                width: CONTENT_WIDTH - 80,
                text: "",
                fontSize: 48,
                align: "center",
              });
            this.group.add(this.questionText);

            // hint text
            this.hintText = new Konva.Text({
                x: contentBox.x() + 40,
                y: this.questionText.y() + 80,
                width: CONTENT_WIDTH - 80,
                text: "BB",
                fontSize: 32,
                align: "center",
                fill: "#333",
                opacity: 0, 
            });
            this.group.add(this.hintText);
            
            // answer box
            const answerBoxHeight = 60;
            const hintButtonWidth = 200; 
            const spacing = 20; 
            this.answerBox = new Konva.Rect({
                x: contentBox.x() + 60,
                y: contentBox.y() + CONTENT_HEIGHT - answerBoxHeight - 120,
                width: CONTENT_WIDTH - 120 - hintButtonWidth - spacing,
                height: answerBoxHeight,
                cornerRadius: 12,
                stroke: "black"
            });
            this.group.add(this.answerBox);

            this.testTitle = new Konva.Text({
                x: contentBox.x() + contentBox.width() / 5,
                y: contentBox.y() + contentBox.height() / 6,
                width: 3 * (contentBox.width()/5),
                fontSize: 48,
                fill: '#e9362aff',
                text:"Test Question:",
                align: 'center',
                visible: false
            });
            this.group.add(this.testTitle);
            
            // answer text in box
            this.answerText = new Konva.Text({
                x: this.answerBox.x() + 15,
                y: this.answerBox.y() + 15,
                fontSize: 32,
                text: "",
                fill: "black",
            });
            this.group.add(this.answerText);

            //used to get length of answer, not a shown UI
            this.measureText = new Konva.Text({ 
                x:0,
                y:0,
                fontSize:32,
                visible:false
            });
            this.group.add(this.measureText);

            this.cursor = new Konva.Rect({
                x: this.answerText.x(),
                y: this.answerText.y(),
                width: 3,
                height: this.answerText.fontSize(),
                fill: 'white'
            });
            this.group.add(this.cursor);
            //add flash to cursor
            setInterval(()=>{
                this.cursor.visible(!this.cursor.visible());
                this.cursor.getLayer()?.batchDraw();
            }, 400);

            // Hint button beside the answer box
            const hintButton = new Konva.Rect({
                x: this.answerBox.x() + this.answerBox.width() + spacing,
                y: this.answerBox.y(),
                width: hintButtonWidth,
                height: answerBoxHeight,
                fill: "#f9d976",
                stroke: "black",
                strokeWidth: 2,
                cornerRadius: 12,
            });
            this.group.add(hintButton);

            hintButton.on("click", () => {
                if (this.onHint) this.onHint();
            });

            const hintButtonText = new Konva.Text({
                x: hintButton.x(),
                y: hintButton.y() + 15,
                width: hintButton.width(),
                text: "Hint 💡",
                fontSize: 32,
                align: "center",
                fill: "black",
            });
            this.group.add(hintButtonText);

            hintButtonText.on("click", () => {
                if (this.onHint) this.onHint();
            });

            this.feedBackBox = new Konva.Rect({
                x: contentBox.x() + contentBox.width()/20,
                y: contentBox.y() + contentBox.height()/8,
                width: (contentBox.width()/10)*9,
                // width: contentBox.width(),
                height: (contentBox.height()/10)*5,
                fill: '',
                stroke:'black',
                opacity: 0.9
            });
            this.feedBackBox.visible(false);
            this.group.add(this.feedBackBox);

            this.feedBack = new Konva.Text({
                x: this.feedBackBox.x(), //should be middle of box
                y: this.feedBackBox.y() + this.feedBackBox.height()/6, 
                width: this.feedBackBox.width(),
                height: this.feedBackBox.height(),
                align: 'center',
                fontSize: 180,
                stroke: 'grey',
                strokeWidth: 2,
                text: "feedback",
                fill: 'white',
            });
            this.feedBack.visible(false);
            this.group.add(this.feedBack);

            this.completeScreen = new Konva.Rect({
                x: contentBox.x(),
                y: contentBox.y(),
                width: contentBox.width(),
                height: contentBox.height(),
                fill: "grey",
                stroke: 'black'
            });
            this.completeScreen.visible(false);
            this.group.add(this.completeScreen);

            this.completeText = new Konva.Text({
                x: contentBox.x(), //should be middle of box
                y: contentBox.y()+contentBox.height()/4,
                width: contentBox.width(),
                height: contentBox.height(),
                text: "Congrats! You finished this level!",
                fontSize: 64,
                align: "center",
                fill: "black"
            });
            this.group.add(this.completeText);
            this.completeText.visible(false);

            //set the priority of each shape
            levelBox.moveToTop();
            this.levelText.moveToTop();
            exitButton.moveToTop();
            exitSymbol.moveToTop();

            // constructing answer text by listening for valid key clicks
            window.addEventListener("keydown", (e) => {
                let pretext = this.currentAnswer.slice(0, this.cursorIndex);
                let rest = this.currentAnswer.slice(this.cursorIndex, this.currentAnswer.length);
                if (e.key === "Backspace") {
                    pretext = pretext.slice(0,-1);
                    this.currentAnswer = pretext + rest;
                    this.cursorIndex--;
                    // this.currentAnswer = this.currentAnswer.slice(0, -1);
                } else if  (e.key === "Enter" && this.onSubmit) {
                    // submit function
                    this.onSubmit(this.currentAnswer);
                    // clear answer
                    this.currentAnswer = "";
                }else if (e.key === "ArrowLeft"){
                    
                    if(this.cursorIndex > 0){
                        this.cursorIndex--;
                    }
                }else if(e.key === "ArrowRight"){
                    if(this.cursorIndex < this.currentAnswer.length){
                        this.cursorIndex++;
                    }
                }else if (/^[0-9]/.test(e.key)) {
                    pretext += e.key;
                    this.currentAnswer = pretext + rest;
                    this.cursorIndex++;
                }
                this.answerText.text(this.currentAnswer);
                this.updateCursor();
                this.answerText.getLayer()?.batchDraw();
                this.cursor.getLayer()?.batchDraw();

            });

            // Redraw items
            setTimeout(() => {
                this.group.getLayer()?.batchDraw();
              }, 0);
		});
	}

    /**
	 * Update the question
	 */
    updateQuestion(question: Question | null, index: number, total: number, retries: number): void {
        this.questionText.text(question?.question);
        if (question?.isTest) {
            this.questionBoxText.text(`Test Retries: ${retries}`);
        } else {
            this.questionBoxText.text(`Question ${index + 1} of ${total}`);
        }
        this.group.getLayer()?.draw();
    }

    /**
	 * Update the progress
	 */
    updateProgress(current: number, total: number): void {
        const progress = total > 0 ? current / total : 0;
        const maxWidth = this.progressBar.width();
        console.log(`Updating progress to ${progress}`);
        // animate progress bar
        this.progressFill.to({
            width: maxWidth * progress,
            duration: 0.4,
            onFinish: () => this.progressFill.getLayer()?.batchDraw(),
        });
    }

    /**
	 * Reset the progress after level completed or exit
	 */
    resetProgress(): void {
        this.progressFill.width(0);
        this.progressFill.fill("green");
        this.group.getLayer()?.batchDraw();
    }

    /**
	 * Update what level user is on 
	 */
    updateLevel(level: number): void {
        this.levelText.text(`Level ${level}`);
    }

    updateHint(hint: string): void {
        this.hintText.text(`${hint}`);
    
        this.hintText.to({
            opacity: 1,
            duration: 0.4,
        });
    
        this.group.getLayer()?.batchDraw();
    }

    resetHint(): void {
        this.hintText.text("");
        this.group.getLayer()?.batchDraw();
    }

    /*
        Update the location of cursor
    */
    private updateCursor(){
        if(!this.cursor || !this.answerText || !this.measureText) return;
        const current = this.currentAnswer.slice(0, this.cursorIndex);
        this.measureText.text(current);
        const length = this.measureText.getTextWidth();
        this.cursor.x(this.answerText.x() + length);
        this.cursor.getLayer()?.batchDraw();
    }
    

    showFeedBack():void{
        if(this.feedBack){
            this.feedBack.show();
            this.feedBackBox.show();
            this.group.getLayer()?.draw();
        }
    }

    hideFeedBack():void{
        if(this.feedBack){
            this.feedBack.hide();
            this.feedBackBox.hide();
            this.group.getLayer()?.draw();
        }
    }

    updateFeedBack(rate:number){
        //rate should be 0,1,2,3 (3 is best, 0 is worst)
        
        switch (rate) {
            case 0:
                this.feedBack.text("TRY AGAIN!");
                this.feedBackBox.fill('red');
                this.feedBack.fontSize(180);
                break;
            case 1:
                this.feedBack.text("GOOD JOB!");
                this.feedBackBox.fill('green');
                this.feedBack.fontSize(180);
                break;
            case 2:
                this.feedBack.text("AWESOME!");
                this.feedBackBox.fill('green');
                this.feedBack.fontSize(180);
                break;
            case 3:
                this.feedBack.text("Uh-oh! Ran out of retries... restarting level!");
                this.feedBackBox.fill('red');
                this.feedBack.fontSize(90);
                break;
        }
        this.group.getLayer()?.draw();
    }

    showComplete():void{
        this.completeScreen.show();
        this.completeText.show();
    }

    hideComplete():void{
        this.completeScreen.hide();
        this.completeText.hide();
    }
    

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}

    //make sure the answer box is clean once the game is started
    initializeAnswer(){
        this.answerText.text("");
        this.currentAnswer = "";
        this.updateCursor();
    }
}