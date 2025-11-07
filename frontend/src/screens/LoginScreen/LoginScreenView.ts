import Konva from "konva";
import type { View } from "../../types";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";

export class LoginScreenView implements View {
    private group: Konva.Group;
    private usernameInput!: HTMLInputElement;
    private passwordInput!: HTMLInputElement;
    private onLogin!: (username: string, password: string) => void;
    private onSignup!: () => void;

    constructor(
        onLogInClick: (username: string, password: string) => void,
        onSignUpClick: () => void
    ) {
        this.group = new Konva.Group({ visible: true });
        this.onLogin = onLogInClick;
        this.onSignup = onSignUpClick;

        /*********************************************/
        // Background image (keeps canvas-style background)
        Konva.Image.fromURL("desertBg2.jpg", (bgImage) => {
            bgImage.x(0);
            bgImage.y(0);
            bgImage.width(STAGE_WIDTH);
            bgImage.height(STAGE_HEIGHT);

            this.group.add(bgImage);
            bgImage.moveToBottom();
            this.group.getLayer()?.draw();
        });
        /*********************************************/

        // Title text
        const title = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 150,
            text: "Escape",
            fontStyle: "bold",
            fontSize: 110,
            fontFamily: "'Impact', 'Arial Black'",
            fill: "#cbe537ff",
            stroke: "black",
            shadowBlur: 10,
            shadowOffset: { x: 10, y: 10 },
            shadowColor: "rgba(72, 82, 48, 0.5)",
            strokeWidth: 5,
            align: "center",
        });
        title.offsetX(title.width() / 2);
        this.group.add(title);

        // Semi-transparent dark rectangle behind the login area
        const panelWidth = 420;
        const panelHeight = 310;
        const panelX = STAGE_WIDTH / 2 - panelWidth / 2;
        const panelY = (STAGE_HEIGHT / 2) - 150; // starts above inputs
        const panelRect = new Konva.Rect({
            x: panelX,
            y: panelY,
            width: panelWidth,
            height: panelHeight,
            fill: "#2f2f2f",
            opacity: 0.6,
            cornerRadius: 12,
        });
        // add behind the buttons/text but above the background
        this.group.add(panelRect);

        // Buttons styled with Konva
        const logInGroup = new Konva.Group();
        const logInButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 100,
            y: STAGE_HEIGHT / 2,
            width: 200,
            height: 60,
            fill: "#cee353ff",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: (STAGE_HEIGHT / 2) + 15,
            text: "Log in",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
        });

        startText.offsetX(startText.width() / 2);
        logInGroup.add(logInButton);
        logInGroup.add(startText);
        // We'll wire click to forward current input values
        logInGroup.on("click", () => {
            this.onLogin(this.usernameInput?.value ?? "", this.passwordInput?.value ?? "");
        });
        // change cursor to pointer on hover
        logInGroup.on("mouseover", () => {
            document.body.style.cursor = "pointer";
        });
        logInGroup.on("mouseout", () => {
            document.body.style.cursor = "default";
        });
        this.group.add(logInGroup);

        /*********************************************/
        // New Player text and Sign up button (placed below the login button)
        const footerGroup = new Konva.Group({ x: STAGE_WIDTH / 2, y: (STAGE_HEIGHT / 2) + 90 });

        const newPlayerText = new Konva.Text({
            x: -75,
            y: 10,
            text: "New Player?",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "#ffffff",
            align: "right",
        });
        newPlayerText.offsetX(newPlayerText.width() / 2);

        // Sign up button sits to the right of the "New Player?" text
        const signUpGroup = new Konva.Group();
        const signUpButton = new Konva.Rect({
            x: 10,
            y: 0,
            width: 140,
            height: 40,
            fill: "#cee353ff",
            cornerRadius: 8,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const stopText = new Konva.Text({
            x: 10 + 70,
            y: 12,
            text: "Sign up",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
        });
        stopText.offsetX(stopText.width() / 2);

        signUpGroup.add(signUpButton);
        signUpGroup.add(stopText);
        signUpGroup.on("click", () => this.onSignup());
        // change cursor to pointer on hover
        signUpGroup.on("mouseover", () => {
            document.body.style.cursor = "pointer";
        });
        signUpGroup.on("mouseout", () => {
            document.body.style.cursor = "default";
        });

        footerGroup.add(newPlayerText);
        footerGroup.add(signUpGroup);
        this.group.add(footerGroup);
        /*********************************************/

        // Create HTML inputs so we can capture username/password (keeps previous behavior)
        this.createFormElements();

        console.log("HomeScreenView initialized");
    }

    /**
     * Clear the username and password input fields (safe if elements not yet created)
     */
    clearInputs(): void {
        if (this.usernameInput) this.usernameInput.value = "";
        if (this.passwordInput) this.passwordInput.value = "";
    }

    private createFormElements(): void {
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "50%";
        // place the inputs centered above the login button (login button y is STAGE_HEIGHT / 2)
        container.style.top = `${(STAGE_HEIGHT / 2) - 180}px`; // ~180px
        container.style.transform = "translateX(-50%)";
        container.style.zIndex = "2"; // above the canvas background

        // Match the visual width of the Konva buttons (200px) and center
        const inputWidth = "200px";

        this.usernameInput = document.createElement("input");
        this.usernameInput.type = "text";
        this.usernameInput.placeholder = "Username";
        this.usernameInput.style.display = "block";
        this.usernameInput.style.margin = "6px auto";
        this.usernameInput.style.padding = "8px";
        this.usernameInput.style.width = inputWidth;
        this.usernameInput.style.boxSizing = "border-box";

        this.passwordInput = document.createElement("input");
        this.passwordInput.type = "password";
        this.passwordInput.placeholder = "Password";
        this.passwordInput.style.display = "block";
        this.passwordInput.style.margin = "6px auto";
        this.passwordInput.style.padding = "8px";
        this.passwordInput.style.width = inputWidth;
        this.passwordInput.style.boxSizing = "border-box";

        container.appendChild(this.usernameInput);
        container.appendChild(this.passwordInput);
        document.body.appendChild(container);

        this.group.on("hide", () => {
            container.style.display = "none";
        });
        this.group.on("show", () => {
            container.style.display = "block";
        });
    }

    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
        // Fire custom event so HTML inputs are shown
        this.group.fire('show');
        console.log("Showing Login Screen");
    }

    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
        // Fire custom event so HTML inputs are hidden
        this.group.fire('hide');
        console.log("Hiding Login Screen");
    }

    getGroup(): Konva.Group {
        console.log("Returning LoginScreen group");
        return this.group;
    }
}