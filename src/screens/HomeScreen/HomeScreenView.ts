import Konva from "konva";
import type { View } from "../../types";
import { STAGE_HEIGHT, STAGE_WIDTH, TOTAL_LEVELS } from "../../constants";
import { HomeScreenController } from "./HomeScreenController";
import { MiniGameInfo } from "../../types";

/*********************************************/
// HomeScreenView.ts
// Dispaly: 1) vertical list of levels on left
//          2) center big "Start Game" button
//          3) vertical list of mini games on right
//          4) user info and log out button on top right
/*********************************************/
// interface LevelInfo      // defines the shape, lock or unlock level
// interface MiniGameInfo   // defines the shape, lock or unlock mini game
// export class HomeScreenView implements View
//      constructor:
//      -- Background
//      -- fake data for testing of level and mini game (Need to remove later)
//      -- private createStartGameButton()
//      -- private createMiniGameButton(game: MiniGameInfo, y: number)     
//      -*- public setMiniGames(games: MiniGameInfo[])
//      -- private createLevelButtons()
//      -*- public setLevels(levels: LevelInfo[])
//      -- private createUserArea()
//      -*- public updateUserName(name: string)
//                            

// for level select
interface LevelInfo {
  id: number;
  unlocked: boolean;
}

export class HomeScreenView implements View {
  private group: Konva.Group;
  private levels: LevelInfo[] = [];
  private miniGames: MiniGameInfo[] = [];

  private onLevelSelect?: (levelId: number) => void;
  private onMiniGameSelect?: (gameName: string) => void;
  private onStartGame?: () => void;
  private onLogout?: () => void;

  // user info and logout button
  private userText: Konva.Text | null = null;
  private logoutButton: Konva.Rect | null = null;
  private logoutText: Konva.Text | null = null;

  constructor(onLevelSelect?: (levelId: number) => void,
              onStartGame?: () => void,
              onMiniGameSelect?: (gameName: string) => void,
			        onLogout?: () => void
) {
    this.group = new Konva.Group({ visible: true });
    this.onLevelSelect = onLevelSelect;
    this.onMiniGameSelect = onMiniGameSelect;
    this.onStartGame = onStartGame;
	  this.onLogout = onLogout;

    // background
   Konva.Image.fromURL("Desert Outpost Concept Art.jpeg", (bgImage: Konva.Image) => {
      bgImage.x(0);
      bgImage.y(0);
      bgImage.width(STAGE_WIDTH);
      bgImage.height(STAGE_HEIGHT);
      this.group.add(bgImage);
      bgImage.moveToBottom();
    });

	
/******fake data for testing of level and mini game buttons****/
	  /*this.createUserArea();

    const testLevels: LevelInfo[] = [
      { id: 1, unlocked: true },
      { id: 2, unlocked: true },
      { id: 3, unlocked: false },
      { id: 4, unlocked: false },
      { id: 5, unlocked: false },
      { id: 6, unlocked: false },
    ];

    const testMiniGames: MiniGameInfo[] = [
      { name: "Mini Game 1", unlocked: true, unlockLevel: 2 },
      { name: "Mini Game 2", unlocked: false, unlockLevel: 4 },
    ];

    // buttons on the right side
    this.createStartGameButton();
    this.setMiniGames(testMiniGames);

    // draw left side levels
    this.setLevels(testLevels);*/
  }

  public createButtons(){
    this.createUserArea();
    this.createStartGameButton();
  }

  /****************** Start Game Button ********************/
  private createStartGameButton(): void {
    const startGroup = new Konva.Group();
    const rect = new Konva.Rect({
      x: STAGE_WIDTH * 0.55,
      y: 150,
      width: 220,
      height: 70,
      fill: "#99ac46ff",
      cornerRadius: 10,
      stroke: "black",
      strokeWidth: 3,
    });

    const text = new Konva.Text({
      x: STAGE_WIDTH * 0.55 + 110,
      y: 170,
      text: "START GAME",
      fontSize: 24,
      fontFamily: "Arial",
      fill: "yellow",
      align: "center",
    });
    text.offsetX(text.width() / 2);

    startGroup.add(rect);
    startGroup.add(text);

    if (this.onStartGame) rect.on("click", this.onStartGame);
    this.group.add(startGroup);
  }

  /****** Mini Game Buttons *****/
  private createMiniGameButton(game: MiniGameInfo, y: number): Konva.Group {
    const group = new Konva.Group();
    const rect = new Konva.Rect({
      x: STAGE_WIDTH * 0.55,
      y,
      width: 220,
      height: 70,
      fill: "#e0e0e0",          
	  stroke: "#555",           
	  strokeWidth: 2,
	  cornerRadius: 6,
    });

    const text = new Konva.Text({
      x: STAGE_WIDTH * 0.55 + 110,
      y: y + 20,
      text: game.unlocked ? game.name : `🔒 ${game.name}`,
      fontSize: 22,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });
    text.offsetX(text.width() / 2);

    if (game.unlocked && this.onMiniGameSelect) {
      rect.on("click", () => this.onMiniGameSelect!(game.name));
    }

    group.add(rect);
    group.add(text);
    return group;
  }

  public setMiniGames(games: MiniGameInfo[]): void {
    this.miniGames = games;
    const baseY = 270;
    const spacing = 100;
    games.forEach((g, i) => {
      const btn = this.createMiniGameButton(g, baseY + i * spacing);
      this.group.add(btn);
    });
  }

  /********* Level Buttons **************/
  private createLevelButtons(): void {
    const startX = STAGE_WIDTH * 0.25;  
	const startY = 100;
	const rectWidth = 180;
	const rectHeight = 60;
	const spacingY = 65;

    this.levels.forEach((level, i) => {
      const y = startY + i * spacingY;
      const rect = new Konva.Rect({
        x: startX,
		y,
		width: rectWidth,
		height: rectHeight,
		fill: "#e0e0e0",          
		stroke: "#555",           
		strokeWidth: 2,
		cornerRadius: 6,
      });

      const label = new Konva.Text({
        x: startX + rectWidth / 2,
		y: y + rectHeight / 4,
		text: level.unlocked ? `Level ${level.id}` : `🔒 Level ${level.id}`,
		fontSize: 20,
		fontFamily: "Arial",
		fill: level.unlocked ? "black" : "#777",
		align: "center",
      });
      label.offsetX(label.width() / 2);

      if (level.unlocked && this.onLevelSelect) {
        rect.on("click", () => this.onLevelSelect!(level.id));
      }

      this.group.add(rect);
      this.group.add(label);
    });
  }

  public setLevels(Currlevel: number): void {
    const levelInfo: LevelInfo[] = [];

    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      levelInfo.push({
        id: i,
        unlocked: i <= Currlevel,
      });
    }
    this.levels = levelInfo;
    this.createLevelButtons();
  }

  /**************Log out Button *****************/
  private createUserArea(): void {
    const padding = 20;

    // Use user name placeholder
    this.userText = new Konva.Text({
      x: STAGE_WIDTH - 250,
      y: padding,
      text: "Hello, User",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#1c1717ff",
    });

    // Red logout button
    this.logoutButton = new Konva.Rect({
      x: STAGE_WIDTH - 110,
      y: padding - 5,
      width: 90,
      height: 30,
      fill: "#ff4d4f",
      cornerRadius: 6,
      stroke: "darkred",
      strokeWidth: 2,
    });

    this.logoutText = new Konva.Text({
      x: STAGE_WIDTH - 65,
      y: padding + 2,
      text: "Log Out",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    });
    this.logoutText.offsetX(this.logoutText.width() / 2);

    // Hover effect
    this.logoutButton.on("mouseenter", () => {
      this.logoutButton!.fill("#e04141");
      this.logoutButton!.getLayer()?.draw();
    });
    this.logoutButton.on("mouseleave", () => {
      this.logoutButton!.fill("#ff4d4f");
      this.logoutButton!.getLayer()?.draw();
    });

   
    if (this.onLogout) {
      this.logoutButton.on("click", this.onLogout);
    }

    this.group.add(this.userText);
    this.group.add(this.logoutButton);
    this.group.add(this.logoutText);
  }

  /******************* Update user name ********************/
public updateUserName(name: string): void {
  if (this.userText) {
    this.userText.text(`Hello, ${name}`);
    this.userText.getLayer()?.draw();
  }
}
  

  show(): void {
    this.group.visible(true);
		this.group.getLayer()?.draw();
    console.log("Showing Home Screen");
  }

  hide(): void {
    this.group.visible(false);
		this.group.getLayer()?.draw();
    console.log("Hiding Home Screen");
  }

  getGroup(): Konva.Group {
    console.log("Returning HomeScreen group");
    return this.group;
  }
}
