import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";

export class Minigame2EntranceScreenView implements View {
    //Main group
    private group: Konva.Group;

    //Background
    private background!: Konva.Image;

    //Start button
    private startButton: Konva.Group;
    private buttonText: Konva.Text;
    private buttonRect: Konva.Rect;

    //Gray rectangle group
    private grayRectangleGroup: Konva.Group;
    private grayRectangle: Konva.Rect;
    private grayRectangleText: Konva.Text;

    //Title
    private title: Konva.Text;

    //Exit button
    private exitButton: Konva.Group;
    private exitRectangle: Konva.Rect;
    private exitText: Konva.Text;


    onStart?: () => void;
    onCompleteExit?: () => void;

    constructor() {
        this.group = new Konva.Group({ visible: false });

        //Create the background image ----------------------------------------
        Konva.Image.fromURL("/Minigame_2_entrance.jpg", (bg: Konva.Image) => {
            this.background = bg;

            bg.width(STAGE_WIDTH);
            bg.height(STAGE_HEIGHT);

			this.group.add(bg);
            bg.moveToBottom();
        });

        //Define the button group -------------------------------------------
        this.startButton = new Konva.Group({
            x: 595,
            y: 635,
        });

        this.startButton.on("mouseenter", () => {
            document.body.style.cursor = "pointer";

            this.buttonRect.fill("#0B486E");  
            this.group.draw();            
        });

        this.startButton.on("mouseleave", () => {
            document.body.style.cursor = "default";

            this.buttonRect.fill("#3B8ABB");
            this.group.draw();            
        });


        this.buttonRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 350,
            height: 184,
            cornerRadius: 50,
            fill: "#3B8ABB",
            stroke: "black",
            strokeWidth: 5,
        });

        this.buttonText = new Konva.Text({
            text: "Start",
            fontFamily: "Rag 123",
            fontSize: 60,
            width: 145,
            height: 73,
            fill: "black",
            align: "center",
            verticalAlign: "middle",
        });

        //Placing buttonText within the button
        this.buttonText.x(this.buttonRect.x() + this.buttonRect.width()/2 - this.buttonText.width()/2);
        this.buttonText.y(this.buttonRect.y() + this.buttonRect.height()/2 - this.buttonText.height()/2);

        this.startButton.add(this.buttonRect);
        this.startButton.add(this.buttonText);

        this.startButton.on("click", () => {
            if (this.onStart) {
                this.onStart();
            }
        });

        this.group.add(this.startButton);

        //Define the gray rectangle group (you still need to decide where to place the button)
        this.grayRectangleGroup = new Konva.Group({
            x: 60,
            y: 214,
        });
        
        this.grayRectangle = new Konva.Rect({
            x: 0,
            y: 0,
            width: 1320,
            height: 400,
            cornerRadius: 50,
            fill: "#504E4E",
            opacity: 0.48
        });

        this.grayRectangleText = new Konva.Text({
            text: "Welcome to MathTrivia!" +
             " Pick a button and see what question you get," +
            " the more questions you answer correctly, the more points you get!",
            fontSize: 60,
            fontStyle: "bold",
            width: 1320,
            height: 400,
            fill: "#8E8E8E",
            stroke: "black",
            strokeWidth: 3,
            align: "center",
            verticalAlign: "middle",
        });

        this.grayRectangleText.x(this.grayRectangle.x() + this.grayRectangle.width()/2 - this.grayRectangleText.width()/2);
        this.grayRectangleText.y(this.grayRectangle.y() + this.grayRectangle.height()/2 - this.grayRectangleText.height()/2);

        this.grayRectangleGroup.add(this.grayRectangle);
        this.grayRectangleGroup.add(this.grayRectangleText);

        this.group.add(this.grayRectangleGroup);

        //Define the title ---------------------------------------------------------
        this.title = new Konva.Text({
            text: "Math Trivia!",
            fontFamily: "'Impact', 'Arial Black'",
            fontStyle: "bold",
            fontSize: 150,
            x: 352.5,
            y: 10,
            width: 735,
            height: 226,
            fill: "#3B8ABB",
            stroke: "black",
            strokeWidth: 10,
            align: "center",
            verticalAlign: "middle",
        });

        this.group.add(this.title);

        //Define the exit button group --------------------------------------------
        this.exitButton = new Konva.Group({
            x: 1252,
            y: 48,
        });

        this.exitButton.on("mouseenter", () => {
            document.body.style.cursor = "pointer";

            this.exitRectangle.fill("#7C0000");  
            this.group.draw();            
        });

        this.exitButton.on("mouseleave", () => {
            document.body.style.cursor = "default";

            this.exitRectangle.fill("#FF0000");
            this.group.draw();            
        });

        this.exitRectangle = new Konva.Rect({
            x: 0,
            y: 0,
            width: 128,
            height: 93,
            cornerRadius: 15,
            fill: "#FF0000",
            stroke: "black",
            strokeWidth: 3,
        });
        
        this.exitText = new Konva.Text({
            text: "Exit",
            x: 10,
            y: 10,
            align: "center",
            verticalAlign: "middle",
            width: 108,
            height: 73,
            fontSize: 50,
            letterSpacing: 2,
            fill: "black",
        });

        this.exitButton.add(this.exitRectangle);
        this.exitButton.add(this.exitText);

        this.exitButton.on("click", () => {
            if (this.onCompleteExit) {
                this.onCompleteExit();
            }
        });

        this.group.add(this.exitButton);
    }

    //Functions that manipulate the view
    showBackground(): void {
        this.background.show();
    }

    showStartButton(): void {
        this.startButton.show();
    }

    showInstructionBox(): void {
        this.grayRectangleGroup.show();
    }

    showTitle(): void {
        this.title.show();
    }

    showExitButton(): void {
        this.exitButton.show();
    }

    getGroup(): Konva.Group {
        return this.group;
    }

    show(): void {
        this.group.show();
    }

    hide(): void {
        this.group.hide();
    }
}
