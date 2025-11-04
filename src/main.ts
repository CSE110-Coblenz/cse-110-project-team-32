import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { HomeScreenController } from "./screens//HomeScreen/HomeScreenController";
import { LoginScreenController } from "./screens/LoginScreen/LoginScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

/**
 * Main Application - Coordinates all screens
 *
 * This class demonstrates screen management using Konva Groups.
 * Each screen (Menu, Game, Results) has its own Konva.Group that can be
 * shown or hidden independently.
 *
 * Key concept: All screens are added to the same layer, but only one is
 * visible at a time. This is managed by the switchToScreen() method.
 */
class App implements ScreenSwitcher {
    private stage: Konva.Stage;
    private layer: Konva.Layer;

    private homeController: HomeScreenController;
    private loginController: LoginScreenController;

    constructor(container: string) {
        // Initialize Konva stage (the main canvas)
        this.stage = new Konva.Stage({
            container,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
        });

        // Create a layer (screens will be added to this layer)
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        //test User
        const testUserId = "TestUser";
        // Initialize all screen controllers
        // Each controller manages a Model, View, and handles user interactions
        this.homeController = new HomeScreenController(this, testUserId, this.layer);
        this.loginController = new LoginScreenController(this);

        // Add all screen groups to the layer
        // All screens exist simultaneously but only one is visible at a time
        this.layer.add(this.homeController.getView().getGroup());
        this.layer.add(this.loginController.getView().getGroup());
        
        // Draw the layer (render everything to the canvas)
        this.layer.draw();

        // Start with login screen visible
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
      this.loginController.getView().show();
    }

    /**
     * Switch to a different screen
     *
     * This method implements screen management by:
     * 1. Hiding all screens (setting their Groups to invisible)
     * 2. Showing only the requested screen
     *
     * This pattern ensures only one screen is visible at a time.
     */
    switchToScreen(screen: Screen): void {
        // Hide all screens first by setting their Groups to invisible
        this.homeController.hide();
        this.loginController.hide();

        // Show the requested screen based on the screen type
        switch (screen.type) {
            case "home":
                this.homeController.show();
                break;
            case "login":
                this.loginController.show();
                break;
        }
    }
}

// Initialize the application
new App("app");