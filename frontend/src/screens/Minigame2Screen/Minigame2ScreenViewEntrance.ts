import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";

export class Minigame2EntranceScreenView implements View {
    //Main group
    private group: Konva.Group;

    //Background
    private background: Konva.Rect;

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

    //Cursor
    private cursor: Konva.Rect;

    onStart?: () => void;
    onCompleteExit?: () => void;

    constructor() {
        this.group = new Konva.Group({ visible: false });

        //Create the background image
        Konva.Image.fromURL("/Minigame_2_entrance.jpg", (bg: Konva.Image) => {
            bg.width(STAGE_WIDTH);
            bg.height(STAGE_HEIGHT);
			this.group.add(bg);
        });

        //Define the button
        this.startButton = new Konva.Group({
            x: 545,
            y: 725,
        });


        this.buttonRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 350,
            height: 184,
            cornerRadius: 50,
            fill: "3B8ABB",
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
            fill: "504E4E",
            opacity: 0.48
        });

        this.grayRectangleText = new Konva.Text({
            text: "Welcome to MathTrivia! \
             Pick a button and see what question you get, \
            the more questions you answer correctly, the more points you get!",
            fontFamily: "Rag 123",
            fontSize: 60,
            width: 1320,
            height: 400,
            fill: "8E8E8E",
            stroke: "black",
            strokeWidth: 3,
            align: "center",
            verticalAlign: "middle",
        });

        this.grayRectangleText.x(this.grayRectangle.x() + this.grayRectangle.width()/2 - this.grayRectangleText.width()/2);
        this.grayRectangleText.y(this.grayRectangle.y() + this.grayRectangle.height()/2 - this.grayRectangleText.height()/2);

        this.grayRectangleGroup.add(this.grayRectangle);
        this.grayRectangleGroup.add(this.grayRectangleText);


    }

}
