import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { LoginScreenView } from "./LoginScreenView.ts";
import { LoginScreenModel } from "./LoginScreenModel.ts";
import { userStore } from "../../context/UserState.ts";

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
    private async handleLogin(username: string, password: string): Promise<void> {
        // TODO: Implement actual authentication logic when database is added
        this.model.setUsername(username);
        this.model.setPassword(password);
        const res = await fetch(`http://localhost:3000/api/user/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        });
        console.log("res is:", res);
        //If the backend threw an error, let the user know, otherwise, just switch to the homescreen
        if (!res.ok) {
            const error = await res.json();
            alert("Login error: " +  error.error);
            return;
        } else {
            const res2 = await fetch(`http://localhost:3000/api/user/username/${username}`);
            console.log("res is:", res2);
            const data = await res2.json();
            console.log("data is:", data);
            userStore.setUsername(data.username);
            userStore.setCurrLevel(data.currLevel);
            this.screenSwitcher.switchToScreen({
                type: "home"
            });
        }

    }

    /**
     * Handle signup request
     */
    private handleSignup(): void {
        // Show the signup modal and handle created account via callback
        this.view.showSignupModal(async (username: string, password: string) => {
            await this.handleCreateAccount(username, password);
        });

    }

    /**
     * Handle account creation (no DB yet) — prefill login and close modal
     */

    private async handleCreateAccount(username: string, password: string): Promise<void> {
        // Store in model (temporarily)
        this.model.setUsername(username);
        this.model.setPassword(password);
        // Prefill the login inputs so the user can log in
        this.view.prefillLoginFields(username, password);
        const res = await fetch(`http://localhost:3000/api/user/newUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password})
        });
        if (!res.ok) {
            const error = await res.json();
            alert("Signup error: " + error.error);
            return;
        } else {
            alert('Account created. You can now log in.');
            const res2 = await fetch(`http://localhost:3000/api/user/username/${username}`);
            console.log("res is:", res2);
            const data = await res2.json();
            console.log("data is:", data);
            userStore.setUsername(data.username);
            userStore.setCurrLevel(data.currLevel);
            this.screenSwitcher.switchToScreen({
                type: "home"
            });
        }

        /*
        // Hide the signup modal
        this.view.hideSignupModal();
        // Optionally notify the user
        alert('Account created. You can now log in.');
        */
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