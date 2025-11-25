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
      this.layer = layer; 
    }

  async init(username: string){
    console.log("initialising homescreen");
    console.log("username:", username);
    this.model.setUsername(username);
    this.model.setMiniGames();
    await this.model.init(username);

    this.view.CreateView(username, this.model.getCurrLevel(), this.model.getMiniGames());
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
    console.log("username:", this.model.getUsername());
  } 
  
  private handleMiniGameClicked(gameName: string): void { 
    console.log("Mini game selected:", gameName); 
    this.screenSwitcher.switchToScreen({ type: "minigame", game: gameName });
  } 

  private handleLogout(): void { 
    console.log("User logged out"); 
    this.screenSwitcher.switchToScreen({ type: "login" }); 
  }
}