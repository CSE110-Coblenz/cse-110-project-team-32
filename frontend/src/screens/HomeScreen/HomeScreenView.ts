import Konva from "konva";
import type { View } from "../../types";
import { STAGE_HEIGHT, STAGE_WIDTH, TOTAL_LEVELS } from "../../constants";
import type { MiniGameInfo } from "../../types";

interface LevelInfo {
  id: number;
  unlocked: boolean;
}

export class HomeScreenView implements View {
  private group: Konva.Group;
  private levels: LevelInfo[] = [];
  private miniGames: MiniGameInfo[] = [];
  private logoutGroup: Konva.Group | null = null;
  private lastLevelBottomY = 0;
  private lastMiniGameBottomY = 0;

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
   Konva.Image.fromURL("desertBg2.jpg", (bgImage: Konva.Image) => {
    //locks its size to the logical stage
      bgImage.x(0);
      bgImage.y(0);
      bgImage.width(STAGE_WIDTH);
      bgImage.height(STAGE_HEIGHT);
      this.group.add(bgImage);
      bgImage.moveToBottom();
    });
  }

  private startGameTopY = 0;

  private createStartGameButton(): void {
    const BTN_WIDTH = 220;
    const BTN_HEIGHT = 70;

    const startGroup = new Konva.Group({
      x: STAGE_WIDTH * 0.55,
      y: STAGE_HEIGHT * 0.35,
    });

    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: BTN_WIDTH,
      height: BTN_HEIGHT,
      fill: "#99ac46ff",
      cornerRadius: 10,
      stroke: "black",
      strokeWidth: 3,
    });

    const text = new Konva.Text({
      x: 110, // center of rect
      y: 35, // adjust to center vertically
      text: "START GAME",
      fontSize: 24,
      fontFamily: "Arial",
      fill: "yellow",
      align: "center",
    });

    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2);

    startGroup.add(rect);
    startGroup.add(text);

    if (this.onStartGame) startGroup.on("click", this.onStartGame);
    this.startGameTopY = startGroup.y(); 

    this.group.add(startGroup);
  }


  /****** Mini Game Buttons *****/
  private createMiniGameButton(game: MiniGameInfo, y: number): Konva.Group {
    // btn size
    const BTN_WIDTH = 220;
    const BTN_HEIGHT = 70;

    // group to hold rect and text
    const group = new Konva.Group({
      x: STAGE_WIDTH * 0.55,
      y,
    });

    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: BTN_WIDTH,
      height: BTN_HEIGHT,
      fill: "#e0e0e0",          
      stroke: "#555",           
      strokeWidth: 2,
      cornerRadius: 6,
    });

    const text = new Konva.Text({
      x: BTN_WIDTH / 2,
      y: BTN_HEIGHT / 2,
      text: game.unlocked ? game.name : `🔒 ${game.name}`,
      fontSize: 22,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
    });

    text.offsetX(text.width() / 2);
    text.offsetY(text.height() / 2);

    if (game.unlocked && this.onMiniGameSelect) {
      group.on("click", () => this.onMiniGameSelect!(game.name));
    }
    
    // hover
    group.on("mouseenter", () => {
      rect.fill("#deb831ff");
      rect.getLayer()?.batchDraw();
    });
    group.on("mouseleave", () => {
      rect.fill("#e0e0e0");
      rect.getLayer()?.batchDraw();
    });

    group.add(rect);
    group.add(text);
    return group;
  }

  public setMiniGames(games: MiniGameInfo[]): void {
    this.miniGames = games;

    const baseY = this.startGameTopY;
    const spacing = 100;

    games.forEach((g, i) => {
      const btn = this.createMiniGameButton(g, baseY + (i+1) * spacing);
      this.group.add(btn);
    });

    this.lastMiniGameBottomY = baseY + (this.miniGames.length - 1) * spacing + 70;
  }

  /********* Level Buttons **************/
  private createLevelButton(level: LevelInfo, y: number): Konva.Group {
  const BTN_WIDTH = 180;
  const BTN_HEIGHT = 60;

  const levelId = level.id; 

  const group = new Konva.Group({ x: STAGE_WIDTH * 0.35, y });

  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: BTN_WIDTH,
    height: BTN_HEIGHT,
    fill: "#e0e0e0",          
    stroke: "#555",           
    strokeWidth: 2,
    cornerRadius: 6,
  });

  const label = new Konva.Text({
    x: BTN_WIDTH / 2,
    y: BTN_HEIGHT / 2,
    text: level.unlocked ? `Level ${levelId}` : `🔒 Level ${levelId}`,
    fontSize: 20,
    fontFamily: "Arial",
    fill: level.unlocked ? "black" : "#777",
    align: "center",
  });
  label.offsetX(label.width() / 2);
  label.offsetY(label.height() / 2);

  if (level.unlocked && this.onLevelSelect) {
    group.on("click", () => this.onLevelSelect!(levelId)); 
  }

  // hover effect
  group.on("mouseenter", () => {
    rect.fill("#deb831ff");
    rect.getLayer()?.batchDraw();
  });
  group.on("mouseleave", () => {
    rect.fill("#e0e0e0");
    rect.getLayer()?.batchDraw();
  });

  group.add(rect);
  group.add(label);
  return group;
}


  private createLevelButtons(): void {
    const BTN_HEIGHT = 60;
    const GAP = 20;

    let currentY = this.startGameTopY - 40;

    this.levels.forEach(level => {
      const btn = this.createLevelButton(level, currentY);
      this.group.add(btn);

      currentY += BTN_HEIGHT + GAP;
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
    
    console.log("currlevel:", Currlevel);
    this.levels = levelInfo;
    this.createLevelButtons();

    this.lastLevelBottomY = this.startGameTopY - 40 + (this.levels.length) * (60 + 20);
  }


  /**************Log out Button *****************/
  private createUserArea(userId: string): void {
    const BTN_WIDTH = 140;
    const BTN_HEIGHT = 40;    

    this.logoutGroup = new Konva.Group({
      x: 0,   // reposition later
      y: 0,
    });
    
    this.userText = new Konva.Text({
      x: 0,
      y: 0,
      text: `Hello ${userId}`,
      fontSize: 25,
      fontFamily: "Arial",
      fill: "white",
      stroke: "black",
      strokeWidth: 1, 
    });

    // Background for "Hello user"
    const helloBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.userText.width() + 20,
      height: this.userText.height() + 10,
      fill: "rgba(0,0,0,0.45)", // 半透明黑
      cornerRadius: 8,
    });

    // Red logout button
    this.logoutButton = new Konva.Rect({
      x: 0,
      y: 50,
      width: BTN_WIDTH,
      height: BTN_HEIGHT,
      fill: "#ff4d4f",
      cornerRadius: 6,
      stroke: "darkred",
      strokeWidth: 2,
    });

    this.logoutText = new Konva.Text({
      x: BTN_WIDTH / 2,
      y: 50 + BTN_HEIGHT / 2,
      text: "Log Out",
      fontSize: 16,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    });

    this.logoutText.offsetX(this.logoutText.width() / 2);
    this.logoutText.offsetY(this.logoutText.height() / 2);

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
      this.logoutText.on("click", this.onLogout);
    }
    
    this.logoutGroup.add(helloBg);
    this.logoutGroup.add(this.userText);
    this.logoutGroup.add(this.logoutButton);
    this.logoutGroup.add(this.logoutText);

    this.group.add(this.logoutGroup);
  }

  private positionLogoutButton(): void {
    if (!this.logoutGroup) return;

    const centerX = (STAGE_WIDTH * 0.25 + STAGE_WIDTH * 0.55) / 2;

    const lowerBottom = Math.max(this.lastLevelBottomY, this.lastMiniGameBottomY);

    const finalX = centerX + this.logoutButton!.width() / 1.5;
    const finalY = lowerBottom + 60;

    console.log("Final logoutGroup X:", finalX);
    console.log("Final logoutGroup Y:", finalY);
    console.log("========================================");

    this.logoutGroup.x(finalX);
    this.logoutGroup.y(finalY);


    this.logoutGroup.getLayer()?.batchDraw();
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

  CreateView(userId: string, currLevel: number , minigames: MiniGameInfo[]){
    this.createStartGameButton();
    this.createUserArea(userId);
    this.setLevels(currLevel);
    this.setMiniGames(minigames);
    this.positionLogoutButton(); 
  }
}
