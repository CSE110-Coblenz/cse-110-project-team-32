import Konva from "konva";
import type { View } from "../../types";
import { STAGE_HEIGHT, STAGE_WIDTH, TOTAL_LEVELS } from "../../constants";
import { HomeScreenController } from "./HomeScreenController";
import { MiniGameInfo } from "../../types";

/*********************************************/
// HomeScreenView.ts
// Display: 1) vertical list of levels on left
//          2) center big "Start Game" button
//          3) vertical list of mini games on right
//          4) user info and log out button on top right
/*********************************************/

interface LevelInfo {
  id: number;
  unlocked: boolean;
}

export class HomeScreenView implements View {
  private group: Konva.Group;
  private levels: LevelInfo[] = [];
  private miniGames: MiniGameInfo[] = [];
  private levelsGroup: Konva.Group;
  private miniGamesGroup: Konva.Group;
  private startGameGroup: Konva.Group | null = null;
  private bgImage: Konva.Image | null = null;

  private onLevelSelect?: (levelId: number) => void;
  private onMiniGameSelect?: (gameName: string) => void;
  private onStartGame?: () => void;
  private onLogout?: () => void;

  // User info and logout button
  private userText: Konva.Text | null = null;
  private logoutButton: Konva.Rect | null = null;
  private logoutText: Konva.Text | null = null;

  constructor(
    onLevelSelect?: (levelId: number) => void,
    onStartGame?: () => void,
    onMiniGameSelect?: (gameName: string) => void,
    onLogout?: () => void
  ) {
    this.group = new Konva.Group({ visible: true });
    this.onLevelSelect = onLevelSelect;
    this.onMiniGameSelect = onMiniGameSelect;
    this.onStartGame = onStartGame;
    this.onLogout = onLogout;
    
    this.levelsGroup = new Konva.Group();
    this.miniGamesGroup = new Konva.Group();
    this.group.add(this.levelsGroup);
    this.group.add(this.miniGamesGroup);

    // Background
    Konva.Image.fromURL("Desert Outpost Concept Art.jpeg", (bgImage: Konva.Image) => {
      this.bgImage = bgImage;
      this.updateBackgroundPosition();
      this.group.add(bgImage);
      bgImage.moveToBottom();
      this.group.getLayer()?.draw();
    });

    // Listen for window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private updateBackgroundPosition(): void {
    if (this.bgImage) {
      this.bgImage.x(0);
      this.bgImage.y(0);
      this.bgImage.width(STAGE_WIDTH);
      this.bgImage.height(STAGE_HEIGHT);
    }
  }

  /****************** Start Game Button ********************/
  private createStartGameButton(): void {
    // Remove old button if exists
    if (this.startGameGroup) {
      this.startGameGroup.destroy();
    }

    this.startGameGroup = new Konva.Group();
    
    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 220,
      height: 70,
      fill: "#99ac46ff",
      cornerRadius: 10,
      stroke: "black",
      strokeWidth: 3,
    });

    const text = new Konva.Text({
      x: 110,
      y: 20,
      text: "START GAME",
      fontSize: 24,
      fontFamily: "Arial",
      fill: "yellow",
      align: "center",
    });
    text.offsetX(text.width() / 2);

    this.startGameGroup.add(rect);
    this.startGameGroup.add(text);

    if (this.onStartGame) {
      rect.on("click", this.onStartGame);
    }

    this.updateStartGameButtonPosition();
    this.group.add(this.startGameGroup);
  }

  private updateStartGameButtonPosition(): void {
    if (this.startGameGroup) {
      // Center the button horizontally, place at 20% from top
      this.startGameGroup.x(STAGE_WIDTH / 2 - 110);
      this.startGameGroup.y(STAGE_HEIGHT * 0.2);
    }
  }

  /****** Mini Game Buttons *****/
  private createMiniGameButton(game: MiniGameInfo, index: number): Konva.Group {
    const group = new Konva.Group();
    
    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 220,
      height: 70,
      fill: game.unlocked ? "#e0e0e0" : "#cccccc",
      stroke: "#555",
      strokeWidth: 2,
      cornerRadius: 6,
    });

    const text = new Konva.Text({
      x: 110,
      y: 20,
      text: game.unlocked ? game.name : `🔒 ${game.name}`,
      fontSize: 20,
      fontFamily: "Arial",
      fill: game.unlocked ? "black" : "#777",
      align: "center",
    });
    text.offsetX(text.width() / 2);

    if (game.unlocked && this.onMiniGameSelect) {
      rect.on("click", () => this.onMiniGameSelect!(game.name));
      rect.on("mouseenter", () => {
        rect.fill("#d0d0d0");
        rect.getLayer()?.draw();
      });
      rect.on("mouseleave", () => {
        rect.fill("#e0e0e0");
        rect.getLayer()?.draw();
      });
    }

    group.add(rect);
    group.add(text);
    return group;
  }

  public setMiniGames(games: MiniGameInfo[]): void {
    this.miniGames = games;
    this.miniGamesGroup.destroyChildren();

    const spacing = 90;
    const startY = STAGE_HEIGHT * 0.35; // Start at 35% from top

    games.forEach((g, i) => {
      const btn = this.createMiniGameButton(g, i);
      btn.y(startY + i * spacing);
      this.miniGamesGroup.add(btn);
    });

    this.updateMiniGamesPosition();
  }

  private updateMiniGamesPosition(): void {
    this.miniGamesGroup.x(STAGE_WIDTH * 0.7 - 110);
  }

  /********* Level Buttons **************/
  private createLevelButtons(): void {
    this.levelsGroup.destroyChildren();

    const rectWidth = 180;
    const rectHeight = 60;
    const spacingY = 70;
    const startY = STAGE_HEIGHT * 0.15; 

    this.levels.forEach((level, i) => {
      const y = startY + i * spacingY;
      const rect = new Konva.Rect({
        x: 0,
        y: y,
        width: rectWidth,
        height: rectHeight,
        fill: level.unlocked ? "#e0e0e0" : "#cccccc",
        stroke: "#555",
        strokeWidth: 2,
        cornerRadius: 6,
      });

      const label = new Konva.Text({
        x: rectWidth / 2,
        y: y + rectHeight / 2 - 10,
        text: level.unlocked ? `Level ${level.id}` : `🔒 Level ${level.id}`,
        fontSize: 20,
        fontFamily: "Arial",
        fill: level.unlocked ? "black" : "#777",
        align: "center",
      });
      label.offsetX(label.width() / 2);

      // Only unlocked levels are clickable
      if (level.unlocked && this.onLevelSelect) {
        rect.on("click", () => this.onLevelSelect!(level.id));
        rect.on("mouseenter", () => {
          rect.fill("#d0d0d0");
          rect.getLayer()?.draw();
        });
        rect.on("mouseleave", () => {
          rect.fill("#e0e0e0");
          rect.getLayer()?.draw();
        });
      }

      this.levelsGroup.add(rect);
      this.levelsGroup.add(label);
    });

    this.updateLevelsPosition();
  }

  private updateLevelsPosition(): void {
    this.levelsGroup.x(STAGE_WIDTH * 0.25 - 90);
  }

  public setLevels(Currlevel: number): void {
    const levelInfo: LevelInfo[] = [];

    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      levelInfo.push({
        id: i,
        unlocked: i <= Currlevel,
      });
    }
    console.log("currlevel:", Currlevel);
    this.levels = levelInfo;
    this.createLevelButtons();
  }

  /**************Log out Button *****************/
  private createUserArea(userId: string): void {
    // Remove old elements if they exist
    if (this.userText) this.userText.destroy();
    if (this.logoutButton) this.logoutButton.destroy();
    if (this.logoutText) this.logoutText.destroy();

    // User name text
    this.userText = new Konva.Text({
      x: 0,
      y: 0,
      text: `Hello ${userId}`,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#1c1717ff",
    });

    // Logout button
    this.logoutButton = new Konva.Rect({
      x: 0,
      y: 0,
      width: 90,
      height: 30,
      fill: "#ff4d4f",
      cornerRadius: 6,
      stroke: "darkred",
      strokeWidth: 2,
    });

    this.logoutText = new Konva.Text({
      x: 45,
      y: 7,
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

    this.updateUserAreaPosition();

    this.group.add(this.userText);
    this.group.add(this.logoutButton);
    this.group.add(this.logoutText);
  }

  private updateUserAreaPosition(): void {
    const padding = 100; 
    const rightMargin = 20; 
    
    if (this.userText) {
      const textWidth = this.userText.width();
      this.userText.x(STAGE_WIDTH - textWidth - 110 - rightMargin);
      this.userText.y(padding);
    }

    if (this.logoutButton) {
      this.logoutButton.x(STAGE_WIDTH - 110 - rightMargin);
      this.logoutButton.y(padding - 5);
    }

    if (this.logoutText) {
      this.logoutText.x(STAGE_WIDTH - 65 - rightMargin);
      this.logoutText.y(padding + 2);
    }
  }

  /******************* Update user name ********************/
  public updateUserName(name: string): void {
    if (this.userText) {
      this.userText.text(`Hello, ${name}`);
      this.userText.getLayer()?.draw();
    }
  }

  /******************* Handle Resize ********************/
  private handleResize(): void {
    this.updateBackgroundPosition();
    this.updateStartGameButtonPosition();
    this.updateLevelsPosition();
    this.updateMiniGamesPosition();
    this.updateUserAreaPosition();
    this.group.getLayer()?.draw();
  }

  show(): void {
    this.group.visible(true);
    this.handleResize(); 
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

  CreateView(userId: string, currLevel: number, minigames: MiniGameInfo[]): void {
    this.createStartGameButton();
    this.createUserArea(userId);
    this.setLevels(currLevel);
    this.setMiniGames(minigames);
  }

  // Clean up event listener when the view is destroyed
  destroy(): void {
    window.removeEventListener('resize', () => this.handleResize());
    this.group.destroy();
  }
}