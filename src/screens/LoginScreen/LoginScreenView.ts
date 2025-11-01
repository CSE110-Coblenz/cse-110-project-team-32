import Konva from "konva";
import type { View } from "../../types";
import { STAGE_HEIGHT, STAGE_WIDTH, } from "../../constants";

export class LoginScreenView implements View {
  private group: Konva.Group;

	constructor(onLogInClick: () => void, onSignUpClick: () => void) {
		this.group = new Konva.Group({ visible: true });

	/*********************************************/
	// Background
  Konva.Image.fromURL("desertBg2.jpg", (bgImage) => {
    bgImage.x(0);
    bgImage.y(0);
    bgImage.width(STAGE_WIDTH);
    bgImage.height(STAGE_HEIGHT);
    
    this.group.add(bgImage);
    bgImage.moveToBottom(); 
    this.group.getLayer()?.draw();
  });
	/*********************************************/
		// Title text
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 150,
			text: "Escape",
			fontStyle: "bold",
			fontSize: 110,
			fontFamily: "'Impact', 'Arial Black'",
			fill: "#cbe537ff", // Gold color
			stroke: "black", // Black outline
			shadowBlur: 10,
			shadowOffset: { x: 10, y: 10 },
			shadowColor: "rgba(72, 82, 48, 0.5)",
			strokeWidth: 5,
			align: "center",
		});
		// Center the text using offsetX
		title.offsetX(title.width() / 2);
		this.group.add(title);

		const logInGroup = new Konva.Group();
		const logInButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 100,
			y: 300,
			width: 200,
			height: 60,
			fill: "#cee353ff",
			cornerRadius: 10,
			stroke: "darkgreen",
			strokeWidth: 3,
		});
		const startText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 315,
			text: "Log in",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});

		startText.offsetX(startText.width() / 2);
		logInGroup.add(logInButton);
		logInGroup.add(startText);
		logInGroup.on("click", onLogInClick);
		this.group.add(logInGroup);
	//}

	/*********************************************/
		// Sign up button
		const signUpGroup = new Konva.Group();
		const signUpButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 100,
			y: 400,
			width: 200,
			height: 60,
			fill: "#cee353ff",
			cornerRadius: 10,
			stroke: "darkgreen",
			strokeWidth: 3,
		});
		const stopText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 415,
			text: "Sign up",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "black",
			align: "center",
		});

		stopText.offsetX(stopText.width() / 2);
		signUpGroup.add(signUpButton);
		signUpGroup.add(stopText);
		signUpGroup.on("click", onSignUpClick);
		this.group.add(signUpGroup);		
	/*********************************************/
  // constructor() {
  //   // Create a simple empty Konva group for now
  //   this.group = new Konva.Group({
  //     x: 0,
  //     y: 0,
  //     width: STAGE_WIDTH,
  //   });

    console.log("HomeScreenView initialized");
  }

  show(): void {
    this.group.visible(true);
		this.group.getLayer()?.draw();
    console.log("Showing Login Screen");
  }

  hide(): void {
    this.group.visible(false);
		this.group.getLayer()?.draw();
    console.log("Hiding Login Screen");
  }

  getGroup(): Konva.Group {
    console.log("Returning LoginScreen group");
    return this.group;
  }
}
