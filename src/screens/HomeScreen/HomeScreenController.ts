import type { ScreenSwitcher, View } from "../../types"
import { ScreenController } from "../../types";
import { HomeScreenView } from "./HomeScreenView";

export class HomeScreenController extends ScreenController {
  private view: HomeScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new HomeScreenView();
  }

  getView(): View {
    return this.view;
  }

  // placeholder lifecycle hooks (optional)
  onEnter(): void {
    console.log("Entered Home Screen");
  }

  onExit(): void {
    console.log("Exited Home Screen");
  }

    private handleResumeClick(): void {
    // route user to appropriate level
  }

  private handleLogoutClick(): void {
    // log user out and redirect to initial game page
  }

  private handleLevelClick(): void {

  }
}
