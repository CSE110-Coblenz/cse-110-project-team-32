import type { ScreenSwitcher, View } from "../../types"
import { ScreenController } from "../../types";
import { HomeScreenView } from "./HomeScreenView";
import { User } from "../../core/models/User";
import { UserService } from "../../core/Services/UserService";
import { HomeScreenModel } from "./HomeScreenModel";
import Konva from "konva";
import { userStore } from "../../context/UserState.ts";

export class HomeScreenController extends ScreenController {
  private view: HomeScreenView;
  private model: HomeScreenModel;
  private screenSwitcher: ScreenSwitcher;
  private layer: Konva.Layer;

  constructor(screenSwitcher: ScreenSwitcher, layer: Konva.Layer) { 
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

  public init(){
    const state = userStore.getState();
    if (!state.username) throw new Error("Username not set in userStore");
    console.log("context username:", state.username, state.currLevel);
    console.log("initialising homescreen");
    this.model.setMiniGames();
    this.model.setUsername(state.username);
    this.model.init();

    this.view.CreateView(this.model.getUsername(), this.model.getCurrLevel(), this.model.getMiniGames());
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
    let levelNum = this.model.getCurrLevel();
    this.screenSwitcher.switchToScreen({ type: "level", level: levelNum }); 
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