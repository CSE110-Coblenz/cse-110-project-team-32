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
        // Show the signup modal and handle created account via callback
        this.view.showSignupModal((username: string, password: string) => {
            this.handleCreateAccount(username, password);
        });
    }

    /**
     * Handle account creation (no DB yet) — prefill login and close modal
     */
    private handleCreateAccount(username: string, password: string): void {
        // Store in model (temporarily)
        this.model.setUsername(username);
        this.model.setPassword(password);
        // Prefill the login inputs so the user can log in
        this.view.prefillLoginFields(username, password);
        // Hide the signup modal
        this.view.hideSignupModal();
        // Optionally notify the user
        alert('Account created. You can now log in.');
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