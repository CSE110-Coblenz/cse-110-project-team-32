import type { ScreenSwitcher, View } from "../../types"
import { ScreenController } from "../../types";
import { HomeScreenView } from "./HomeScreenView";
import { User } from "../../core/models/User";
import { UserService } from "../../core/Services/UserService";

export class HomeScreenController extends ScreenController {
  private view: HomeScreenView;
  private screenSwitcher: ScreenSwitcher;
  private user!: User;
  private userId: string;

  constructor(screenSwitcher: ScreenSwitcher, userId: string) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new HomeScreenView();
    this.userId = userId;
  }

  getView(): View {
    return this.view;
  }

  // placeholder lifecycle hooks (optional)
  async onEnter(): Promise<void> {
    this.user = await UserService.loadUserData(this.userId);
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
    // do UserServce.saveUser before you finish
  }

  private handleLevelClick(): void {

  }
}
