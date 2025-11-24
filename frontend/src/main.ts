import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { HomeScreenController } from "./screens//HomeScreen/HomeScreenController";
import { GameScreenController } from "./screens//GameScreen/GameScreenController";
import { LoginScreenController } from "./screens/LoginScreen/LoginScreenController";
import { Minigame1ScreenController } from "./screens/Minigame1Screen/Minigame1ScreenController";
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
    private gameController: GameScreenController;
    private loginController: LoginScreenController;
	private minigame1Controller: Minigame1ScreenController;

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
        this.gameController = new GameScreenController(this);
        this.loginController = new LoginScreenController(this);
		this.minigame1Controller = new Minigame1ScreenController(this, this.layer);

        // Add all screen groups to the layer
        // All screens exist simultaneously but only one is visible at a time
        this.layer.add(this.homeController.getView().getGroup());
        this.layer.add(this.gameController.getView().getGroup());
        this.layer.add(this.loginController.getView().getGroup());
		this.layer.add(this.minigame1Controller.getView().getGroup());
        
        // Draw the layer (render everything to the canvas)
        this.layer.draw();

        // Start with menu screen visible
		// COMMENT THIS LINE FOR TESTING GAME LEVEL SCREEN
		this.homeController.getView().show();

		// UNCOMMENT THESE LINE FOR TESTING GAME LEVEL SCREEN
		// this.gameController.getView().show();
		// this.gameController.startGame();

        

		// Scale the stage to fit window
		this.scaleStageToFit();

		// Update scale when the window resizes
		window.addEventListener("resize", () => this.scaleStageToFit());

        // Start with login screen visible
        this.initializeScreens();
    }

    /**
	 * Scale the stage to fit the current window size while maintaining aspect ratio
	 */
	private scaleStageToFit(): void {
		// Use Math.max instead of Math.min for “cover” behavior
		const scale = Math.max(
		  window.innerWidth / STAGE_WIDTH,
		  window.innerHeight / STAGE_HEIGHT
		);
	  
		// Scale the entire stage
		this.stage.scale({ x: scale, y: scale });
	  
		// Resize visible area
		this.stage.width(STAGE_WIDTH * scale);
		this.stage.height(STAGE_HEIGHT * scale);
	  
		// Center it
		this.stage.x((window.innerWidth - STAGE_WIDTH * scale) / 2);
		this.stage.y((window.innerHeight - STAGE_HEIGHT * scale) / 2);
	  
		this.stage.draw();
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
      this.gameController.getView().show();
	  this.minigame1Controller.getView().show();

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
        this.gameController.hide();
		this.minigame1Controller.getView().hide();

        // Show the requested screen based on the screen type
        switch (screen.type) {
            case "home":
                this.homeController.show();
                break;
            case "level":
                console.log(screen.level);
                //this.gameController.setLevel(screen.level);
                this.gameController.show();
                this.gameController.startGame(screen.level);
                break;
            case "login":
                this.loginController.show();
                break;
			case "minigame":
                if (screen.game === "Sequence Rush") {
                    this.minigame1Controller.getView().show();
                    // this.minigame1Controller.startGame?.();
                }
                break;
        }
    }
}

// Initialize the application
console.log("main loaded");
new App("container");
