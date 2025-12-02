import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { HomeScreenController } from "./screens//HomeScreen/HomeScreenController";
import { GameScreenController } from "./screens//GameScreen/GameScreenController";
import { LoginScreenController } from "./screens/LoginScreen/LoginScreenController";
import { Minigame1ScreenController } from "./screens/Minigame1Screen/Minigame1ScreenController";
import { Minigame2ScreenController } from "./screens/Minigame2Screen/Minigame2ScreenController";
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
    private minigame2Controller: Minigame2ScreenController;

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
        this.minigame2Controller = new Minigame2ScreenController(this);


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
        const scale1 = window.innerWidth / STAGE_WIDTH;
        const scale2 = window.innerHeight / STAGE_HEIGHT;
	  
		// Scale the entire stage
		this.stage.scale({ x: scale1, y: scale2 });
	  
		// Resize visible area
		this.stage.width(STAGE_WIDTH * scale1);
		this.stage.height(STAGE_HEIGHT * scale2);
	  
		// Center it
		this.stage.x((window.innerWidth - STAGE_WIDTH * scale1) / 2);
		this.stage.y((window.innerHeight - STAGE_HEIGHT * scale2) / 2);
	  
		this.stage.draw();

        // updates login screen with resized window to resize username/password fields
        this.loginController.getView().updateStageScale(scale1);

	  }



    /**
    * Initializes all screens, adds them to the layer, and sets the starting screen.
    */
    private initializeScreens(): void{
        // Initialize home screen (loads user data, levels, etc.)
        this.homeController.init();

        
        this.layer.add(this.loginController.getView().getGroup());
        this.layer.add(this.homeController.getView().getGroup());
        this.layer.add(this.gameController.getView().getGroup());
        this.layer.add(this.minigame1Controller.getView().getGroup());
        this.layer.add(this.minigame2Controller.getView().getGroup());
        this.layer.add(this.minigame2Controller.getView2().getGroup());
        this.layer.add(this.minigame2Controller.getView3().getGroup());


        // Render the layer
        this.layer.draw();
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
        this.minigame2Controller.getView().hide();
        this.minigame2Controller.getView2().hide();
        this.minigame2Controller.getView3().hide();

        // Show the requested screen based on the screen type
        switch (screen.type) {
            case "home":
                this.homeController.init();
                this.homeController.show();
                break;
            case "level":
                console.log(screen.level);
                this.gameController.show();
                this.gameController.startGame(screen.level);
                break;
            case "login":
                this.loginController.show();
                break;
            case "minigame":
                if (screen.game === "Sequence Rush") {
                    this.minigame1Controller.getView().show();
                } else if (screen.game == "Math Trivia!") {
                    this.minigame2Controller.startMinigame2Entrance();
                    this.minigame2Controller.getView().show();
                }
                break; 
            case "intro":
                this.minigame2Controller.show();
                this.minigame2Controller.startMinigame2Entrance();
                break;
            case "pick":
                this.minigame2Controller.show2();
                this.minigame2Controller.startMinigame2Entrance2();
                break;
            case "question":
                this.minigame2Controller.show3();
                this.minigame2Controller.startNewQuestion();
                break;
        }
    }
}

// Initialize the application
console.log("main loaded");
new App("container");
