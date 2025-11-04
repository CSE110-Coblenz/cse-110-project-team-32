import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { LoginScreenView } from "./LoginScreenView.ts";
import { LoginScreenModel } from "./LoginScreenModel.ts";

/**
 * LoginScreenController - Handles Login interactions
 */
export class LoginScreenController extends ScreenController {
    private view: LoginScreenView;
    private model: LoginScreenModel;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.model = new LoginScreenModel();
        this.view = new LoginScreenView(
            (username, password) => this.handleLogin(username, password),
            () => this.handleSignup()
        );
    }

    /**
     * Handle login attempt
     */
    private handleLogin(username: string, password: string): void {
        // TODO: Implement actual authentication logic when database is added
        if (username && password) {
            this.model.setUsername(username);
            this.model.setPassword(password);
            // For now, any non-empty username/password combination will work
            this.screenSwitcher.switchToScreen({
                type: "home",
            });
        } else {
            alert("Please enter both username and password");
        }
    }

    /**
     * Handle signup request
     */
    private handleSignup(): void {
        // TODO: Implement signup logic when database is added
        alert("Sign up functionality will be added soon!");
    }

    /**
     * Show the login screen
     */
    show(): void {
        this.view.show();
    }

    /**
     * Hide the login screen
     */
    hide(): void {
        this.view.hide();
        this.view.clearInputs();
    }

    /**
     * Get the view
     */
    getView(): LoginScreenView {
        return this.view;
    }
}