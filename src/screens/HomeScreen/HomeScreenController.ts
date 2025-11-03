import type { ScreenSwitcher, View } from "../../types"
import { ScreenController } from "../../types";
import { HomeScreenView } from "./HomeScreenView";
import { User } from "../../core/models/User";
import { UserService } from "../../core/Services/UserService";
import { HomeScreenModel } from "./HomeScreenModel";

export class HomeScreenController extends ScreenController {
  private view: HomeScreenView;
  private model: HomeScreenModel;
  private screenSwitcher: ScreenSwitcher;
  private user!: User;
  private userId: string;

  constructor(screenSwitcher: ScreenSwitcher, userId: string) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new HomeScreenView();
    this.model = new HomeScreenModel();
    this.userId = userId;
  }

  // placeholder lifecycle hooks (optional)
async onEnter(): Promise<void> {
  this.user = await UserService.loadUserData(this.userId);
  console.log("Entered Home Screen");
  
  // set the levels
  this.model.setCurrentLevel();
  this.view.setLevels(this.model.getCurrLevel());

  // set the user area
  this.view.createButtons();

  //set mini games
  this.model.setMiniGames();
  this.view.setMiniGames(this.model.getMiniGames());
  
  // Show the view!
  this.view.show();
}

  onExit(): void {
    console.log("Exited Home Screen");
  }

  private handleResumeClick(): void {
    // route user to appropriate level

  }

  private async handleLogoutClick(): Promise<void> {
    // log user out and redirect to initial game page
    // do UserServce.saveUser before you finish
    try{
      await UserService.saveUserData(this.user);
      console.log("User data saved successfully. Logging out...");
      this.screenSwitcher.switchToScreen({ type: "start" }); // TODO change this up to whatever the start page is called
    } catch (error) {
      console.error("Failed to save user data:", error);
    }

  }

  private handleLevelClick(): void {

    // detect which level number is clicked
    //let clickedLevelNum = this.view.levelClicked();  -> uncomment this and add the levelClicked function to view

    let clickedLevelNum = 1;

    // if level is above max level then dont do anything -> deny request
    if (this.user.lockedLevels.includes(clickedLevelNum)){
      console.log("Level is locked.")
      return;
    }

    // level is less than equal to the max level then continue on to that page
    console.log(`Navigating to level ${clickedLevelNum}...`);
    this.screenSwitcher.switchToScreen({ type: "level", level: clickedLevelNum });

  }

  // get view and display
  getView(): View {
    return this.view;
  }
}
