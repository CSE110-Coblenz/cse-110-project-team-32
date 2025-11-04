import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

/**
 * Main Application
 * 
 * Coordinates all screens and manages transitions between them.
 * 
 * Architecture:
 * - Each screen (Home, Game, etc.) has its own Controller (MVC pattern).
 * - All screen groups are added to the same Konva Layer.
 * - Only one screen is visible at a time via `switchToScreen()`.
 */
class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  // Screen controllers
  private homeController: HomeScreenController;

  constructor(containerId: string) {
    // Initialize Konva stage (main canvas)
    this.stage = new Konva.Stage({
      container: containerId,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
    });

    // Create a single shared layer
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Initialize all screen controllers
    const testUserId = "TestUser123";
    this.homeController = new HomeScreenController(this, testUserId, this.layer);

    // Start the app asynchronously
    this.initializeScreens();
  }

  /**
   * Initializes all screens, adds them to the layer, and sets the starting screen.
   */
  private initializeScreens(): void{
    // Initialize home screen (loads user data, levels, etc.)
    this.homeController.init();

    // Add all screen groups to the shared layer
    this.layer.add(this.homeController.getView().getGroup());

    // Render the layer
    this.layer.draw();

    // Show starting screen
    this.homeController.getView().show();
  }

  /**
   * Switches between screens by hiding all others and showing the target screen.
   */
  switchToScreen(screen: Screen): void {
    // Hide all screens
    this.homeController.getView().hide();

    // Show the requested screen
    switch (screen.type) {
      case "home":
        this.homeController.getView().show();
        break;
      // You can add future screens here
      // case "game": this.gameController.getView().show(); break;
    }
  }
}

// Initialize the app when DOM is ready
new App("app");
