
import Konva from "konva";
import type { View } from "../../types";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";

export class LoginScreenView implements View {

    //Main group
    private group: Konva.Group;

    //Central group
    private centralGroup: Konva.Group;

    //All the pieces of UI inside of the central group
    private title: Konva.Text;
    private panelGroup: Konva.Group;

    //All the pieces of UI inside of the panel centralGroup
    private panelRect: Konva.Rect;
    private passwordRequestText: Konva.Text;
    private usernameInput!: HTMLInputElement;
    private passwordInput!: HTMLInputElement;
    private loginGroup: Konva.Group;
    private footerGroup: Konva.Group;

    //All the pieces of UI inside loginGroup
    private loginRect: Konva.Rect;
    private loginText: Konva.Text;

    //All the pieces of UI inside of the footer
    private newPlayerText: Konva.Text;
    private signUpGroup: Konva.Group;

    //All the pieces of UI inside of the signUpGroup
    private signUpRect: Konva.Rect;
    private signUpText: Konva.Text;

    private inputContainer!: HTMLDivElement;
    private stageScale: number = 1;

    private onLogin!: (username: string, password: string) => void;
    private onSignup!: () => void;

    private signupModalContainer?: HTMLDivElement;
    private signupCreateCallback?: (username: string, password: string) => void;

    constructor(
        onLogInClick: (username: string, password: string) => void,
        onSignUpClick: () => void
    ) {

        this.group = new Konva.Group();

        this.centralGroup = new Konva.Group({ 
            visible: true,
            x: 420,
            y: 112,
        });

        this.group.add(this.centralGroup);
        
        this.onLogin = onLogInClick;
        this.onSignup = onSignUpClick;

        //---------------------------------------------
        // BACKGROUND IMAGE
        //---------------------------------------------
        Konva.Image.fromURL("desertBg2.jpg", (bgImage) => {
                bgImage.x(0);
                bgImage.y(0);
                bgImage.width(STAGE_WIDTH);
                bgImage.height(STAGE_HEIGHT);

                this.group.add(bgImage);
                bgImage.moveToBottom();
                this.group.getLayer()?.draw();
        });

        //---------------------------------------------
        // TITLE
        //---------------------------------------------
        this.title = new Konva.Text({
            //x: STAGE_WIDTH / 2,
            //y: 150,
            x: 93,
            y: 41,
            text: "Escape",
            fontStyle: "bold",
            fontSize: 140,
            fontFamily: "'Impact', 'Arial Black'",
            fill: "#cbe537ff",
            stroke: "black",
            strokeWidth: 5,
            align: "center",
            shadowBlur: 10,
            shadowOffset: { x: 10, y: 10 },
            shadowColor: "rgba(72, 82, 48, 0.5)",
        });
        this.centralGroup.add(this.title);


        //----------------------------------------------------
        // CREATING ALL THE ELEMENTS INSIDE OF THE PANEL GROUP
        //----------------------------------------------------

        this.panelGroup = new Konva.Group({ 
            visible: true,
            x: 50,
            y: 212,
         });

        this.centralGroup.add(this.panelGroup);

        //---------------------------------------------
        // PANEL BEHIND INPUT AREA
        //---------------------------------------------
        const panelWidth = 500;
        const panelHeight = 400;
        this.panelRect = new Konva.Rect({
            //x: STAGE_WIDTH / 2 - panelWidth / 2,
            //y: STAGE_HEIGHT / 2 - 150,
            x: 0,
            y: 0,
            width: panelWidth,
            height: panelHeight,
            fill: "#2f2f2f",
            opacity: 0.6,
            cornerRadius: 12,
        });
        this.panelGroup.add(this.panelRect);

        //-----------------------------------------------------------
        //  TEXT REQUESTING THE USER TO INPUT A LONG ENOUGH PASSWORD
        //-----------------------------------------------------------

        this.passwordRequestText = new Konva.Text({
            text: "Please enter a password that is 12 characters or longer",
            x: 62,
            y: 39,
            fontFamily: "Arial",
            fontSize: 16,
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });

        this.panelGroup.add(this.passwordRequestText);



        //---------------------------------------------
        // LOGIN BUTTON
        //---------------------------------------------
        this.loginGroup = new Konva.Group({
            x: 150,
            y: 238,
        });

        this.loginRect = 
            new Konva.Rect({
                x: 0,
                y: 0,
                width: 200,
                height: 60,
                fill: "#cee353ff",
                cornerRadius: 10,
                stroke: "darkgreen",
                strokeWidth: 3,
            })

        this.loginGroup.add(this.loginRect);

        this.loginText = new Konva.Text({
            x: 70,
            y: 16,
            text: "Log in",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
        });

        this.loginGroup.add(this.loginText);

        this.loginGroup.on("click", () => {
            this.onLogin(this.usernameInput.value, this.passwordInput.value);
        });
        this.loginGroup.on("mouseover", () => (document.body.style.cursor = "pointer"));
        this.loginGroup.on("mouseout", () => (document.body.style.cursor = "default"));

        this.panelGroup.add(this.loginGroup);

        //---------------------------------------------
        // SIGN UP FOOTER
        //---------------------------------------------
        this.footerGroup = new Konva.Group({
            x: 59,
            y: 303,
        });

        this.panelGroup.add(this.footerGroup);

        //----------------------------------------------
        // PLAYER TEXT
        //----------------------------------------------

        this.newPlayerText = new Konva.Text({
            x: 59,
            y: 28,
            text: "New Player?",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "white",
            align: "right",
        });

        this.newPlayerText.offsetX(this.newPlayerText.width() / 2);
        this.footerGroup.add(this.newPlayerText);

        //------------------------------------------------
        // SIGNUP BUTTON
        //------------------------------------------------

        this.signUpGroup = new Konva.Group({
            x: 226,
            y: 20,
        });

        this.signUpRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 140,
            height: 40,
            fill: "#cee353ff",
            cornerRadius: 8,
            stroke: "darkgreen",
            strokeWidth: 3,
        });

        this.signUpGroup.add(this.signUpRect);

        this.signUpText = new Konva.Text({
            x: 45,
            y: 10,
            text: "Sign up",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
        });
        this.signUpGroup.add(this.signUpText);

        this.signUpGroup.on("click", () => this.onSignup());
        this.signUpGroup.on("mouseover", () => (document.body.style.cursor = "pointer"));
        this.signUpGroup.on("mouseout", () => (document.body.style.cursor = "default"));

        this.footerGroup.add(this.signUpGroup);

        //---------------------------------------------
        // DOM INPUTS
        //---------------------------------------------
        this.createInputElements();
        this.createSignupModal();

        console.log("HomeScreenView initialized");
    }

    //-------------------------------------------------------
    // CREATE USERNAME + PASSWORD INPUT FIELDS
    //-------------------------------------------------------
    private createInputElements(): void {
        this.inputContainer = document.createElement("div");
        document.body.appendChild(this.inputContainer);

        this.inputContainer.style.position = "absolute";
        this.inputContainer.style.left = "50%";
        this.inputContainer.style.transformOrigin = "top left";
        this.inputContainer.style.zIndex = "3";

        // Username
        this.usernameInput = document.createElement("input");
        this.usernameInput.type = "text";
        this.usernameInput.placeholder = "Username";
        this.usernameInput.style.display = "block";
        this.usernameInput.style.margin = "6px auto";
        this.usernameInput.style.padding = "8px";
        this.usernameInput.style.width = "200px";
        this.usernameInput.style.boxSizing = "border-box";

        // Password
        this.passwordInput = document.createElement("input");
        this.passwordInput.type = "password";
        this.passwordInput.placeholder = "Password";
        this.passwordInput.style.display = "block";
        this.passwordInput.style.margin = "6px auto";
        this.passwordInput.style.padding = "8px";
        this.passwordInput.style.width = "200px";
        this.passwordInput.style.boxSizing = "border-box";

        this.inputContainer.appendChild(this.usernameInput);
        this.inputContainer.appendChild(this.passwordInput);

        // show/hide when Konva group is shown/hidden
        this.group.on("hide", () => (this.inputContainer.style.display = "none"));
        this.group.on("show", () => {
            this.inputContainer.style.display = "block";
            this.updateInputLayout();
        });
    }

    //-------------------------------------------------------
    // CENTRAL PLACE TO APPLY SCALING + POSITION
    //-------------------------------------------------------
    public updateStageScale(scale: number): void {
        this.stageScale = scale;
        this.updateInputLayout();
    }

    private updateInputLayout(): void {
        // Base canvas coordinates
        const inputCanvasX = STAGE_WIDTH / 2 - 50;
        const inputCanvasY = STAGE_HEIGHT / 2 - 100;

        // Convert to actual screen pixels
        const screenX = inputCanvasX * this.stageScale;
        const screenY = inputCanvasY * this.stageScale;

        // Move container
        this.inputContainer.style.left = `${screenX}px`;
        this.inputContainer.style.top = `${screenY}px`;

        // Apply scale
        this.inputContainer.style.transform = `translateX(-50%) scale(${this.stageScale})`;
    }

    //-------------------------------------------------------
    // CLEAR INPUTS
    //-------------------------------------------------------
    clearInputs(): void {
        if (this.usernameInput) this.usernameInput.value = "";
        if (this.passwordInput) this.passwordInput.value = "";
    }

    //-------------------------------------------------------
    // SIGNUP MODAL (unchanged from your original)
    //-------------------------------------------------------
    private createSignupModal(): void {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.display = 'none';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10';
        overlay.style.background = 'rgba(0,0,0,0.45)';

        const box = document.createElement('div');
        box.style.background = '#ffffff';
        box.style.padding = '24px';
        box.style.borderRadius = '10px';
        box.style.minWidth = '320px';
        box.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
        box.style.fontFamily = "'Arial', sans-serif";
        box.style.color = '#222';

        const title = document.createElement('div');
        title.textContent = 'Create Account';
        title.style.fontSize = '22px';
        title.style.marginBottom = '12px';
        title.style.fontFamily = "'Impact', 'Arial Black', sans-serif";
        title.style.color = '#cbe537';
        box.appendChild(title);

        const newUserInput = document.createElement('input');
        newUserInput.type = 'text';
        newUserInput.placeholder = 'New username';
        newUserInput.style.display = 'block';
        newUserInput.style.width = '100%';
        newUserInput.style.marginBottom = '10px';
        newUserInput.style.padding = '10px';
        newUserInput.style.borderRadius = '6px';
        newUserInput.style.border = '1px solid #ccc';
        newUserInput.style.fontSize = '14px';
        newUserInput.style.fontFamily = "Arial, sans-serif";
        box.appendChild(newUserInput);

        const newPassInput = document.createElement('input');
        newPassInput.type = 'password';
        newPassInput.placeholder = 'New password';
        newPassInput.style.display = 'block';
        newPassInput.style.width = '100%';
        newPassInput.style.marginBottom = '16px';
        newPassInput.style.padding = '10px';
        newPassInput.style.borderRadius = '6px';
        newPassInput.style.border = '1px solid #ccc';
        newPassInput.style.fontSize = '14px';
        newPassInput.style.fontFamily = "Arial, sans-serif";
        box.appendChild(newPassInput);

        const createButton = document.createElement('button');
        createButton.textContent = 'Create account';
        createButton.style.padding = '10px';
        createButton.style.cursor = 'pointer';
        createButton.style.width = '100%';
        createButton.style.background = '#cee353';
        createButton.style.border = '3px solid darkgreen';
        createButton.style.borderRadius = '8px';
        createButton.style.fontFamily = 'Arial, sans-serif';
        createButton.style.fontSize = '16px';
        createButton.style.color = 'black';
        createButton.onclick = () => {
            const u = newUserInput.value.trim();
            const p = newPassInput.value.trim();
            if (!u || !p) {
                alert('Please enter both username and password to create an account');
                return;
            }
            // call controller callback
            if (this.signupCreateCallback) this.signupCreateCallback(u, p);
            // hide modal
            overlay.style.display = 'none';
            // clear modal inputs
            newUserInput.value = '';
            newPassInput.value = '';
        };
        box.appendChild(createButton);

        // optional cancel when clicking overlay
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.style.display = 'none';
        };

        overlay.appendChild(box);
        document.body.appendChild(overlay);
        this.signupModalContainer = overlay;
    }

    showSignupModal(onCreate: (username: string, password: string) => void): void {
        this.signupCreateCallback = onCreate;
        if (this.signupModalContainer) this.signupModalContainer.style.display = 'flex';
    }

    hideSignupModal(): void {
        if (this.signupModalContainer) this.signupModalContainer.style.display = 'none';
    }

    prefillLoginFields(username: string, password: string): void {
        if (this.usernameInput) this.usernameInput.value = username;
        if (this.passwordInput) this.passwordInput.value = password;
    }

    //-------------------------------------------------------
    // SHOW/HIDE
    //-------------------------------------------------------
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
        this.group.fire("show");
    }

    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
        this.group.fire("hide");
    }

    //-------------------------------------------------------
    // RETURN KONVA GROUP
    //-------------------------------------------------------
    getGroup(): Konva.Group {
        return this.group;
    }
}
