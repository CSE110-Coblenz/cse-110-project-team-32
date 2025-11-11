import type { ScreenSwitcher, View } from "../../types"
import { ScreenController } from "../../types";
import { HomeScreenView } from "./HomeScreenView";
import { User } from "../../core/models/User";
import { UserService } from "../../core/Services/UserService";
import { HomeScreenModel } from "./HomeScreenModel";
import Konva from "konva";

export class HomeScreenController extends ScreenController {
  private view: HomeScreenView;
  private model: HomeScreenModel;
  private screenSwitcher: ScreenSwitcher;
  private user!: User;
  private userId: string;
  private layer: Konva.Layer;

  constructor(screenSwitcher: ScreenSwitcher, userId: string, layer: Konva.Layer) { 
    super(); 
    this.screenSwitcher = screenSwitcher; this.view = new HomeScreenView( 
      (levelId) => this.handleLevelClicked(levelId), // onLevelSelect 
      () => this.handleStartGame(), // onStartGame 
      (gameName) => this.handleMiniGameClicked(gameName), // onMiniGameSelect 
      () => this.handleLogout() // onLogout 
      ); 
      this.model = new HomeScreenModel(); 
      this.userId = userId; 
      this.layer = layer; 
    }

  init(){
    console.log("initialising homescreen");

    this.model.setCurrentLevel();
    this.model.setMiniGames();

    this.view.CreateView(this.userId, this.model.getCurrLevel(), this.model.getMiniGames());
    this.layer.add(this.view.getGroup());
    this.layer.draw();
    this.view.show();
  }

  getView(): View {
    return this.view;
  }

  private handleLevelClicked(levelNum: number): void { 
    console.log("Level button clicked:", levelNum); 
    this.screenSwitcher.switchToScreen({ type: "level", level: levelNum }); 
  } 
  
  private handleStartGame(): void { 
    console.log("Start Game clicked!"); // You could call: this.screenSwitcher.switchToScreen({ type: "level", level: this.model.getCurrLevel() }); 
  } 
  private handleMiniGameClicked(gameName: string): void { 
    console.log("Mini game selected:", gameName); 
  } 
  private handleLogout(): void { 
    console.log("User logged out"); 
    this.screenSwitcher.switchToScreen({ type: "login" }); 
  }
}
