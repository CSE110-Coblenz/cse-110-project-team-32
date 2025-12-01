import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";

export class Minigame2RoomScreenView implements View {
    private group: Konva.Group = new Konva.Group({ visible: false });

    private background?: Konva.Image;
    private tintRect?: Konva.Rect;

    // top bar
    private pointText?: Konva.Text;
    private questionTextTop?: Konva.Text;

    // progress bar
    private barBack?: Konva.Rect;
    private barFront?: Konva.Rect;

    // question container
    private questionContainer?: Konva.Group;
    private questionDialog?: Konva.Rect;
    private questionText?: Konva.Text;

    // DOM input for user answer
    private inputContainer?: HTMLDivElement;
    private answerInput?: HTMLInputElement;

    // small feedback boxes
    private correctBox?: Konva.Group;
    private wrongBox?: Konva.Group;
    private invalidBox?: Konva.Group;
    private backX?: Konva.Group;

    // results modal
    private resultsGroup?: Konva.Group;

    onSubmit?: (answer: String) => void;
    restart?: () => void;
    onPartialExit?: () => void;
    onCompleteExit?: () => void;
    onBack?: () => void;

    constructor() {
        // background placeholder -- image loaded on showRoom

        // top bar: points and question num
        this.pointText = new Konva.Text({
            x: 40,
            y: 30,
            text: "Points: 0",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            padding: 6,
            cornerRadius: 6,
        });
        this.group.add(this.pointText);

        this.questionTextTop = new Konva.Text({
            x: STAGE_WIDTH - 260,
            y: 30,
            text: "Question 0",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            padding: 6,
            align: "right",
        });
        this.group.add(this.questionTextTop);

        // progress bar
        this.barBack = new Konva.Rect({
            x: 40,
            y: 70,
            width: STAGE_WIDTH - 80,
            height: 24,
            fill: "#e0e0e0",
            cornerRadius: 8,
            opacity: 0.9,
        });
        this.barFront = new Konva.Rect({
            x: 40,
            y: 70,
            width: 0,
            height: 24,
            fill: "#3fb23f",
            cornerRadius: 8,
        });
        this.group.add(this.barBack);
        this.group.add(this.barFront);

        // question container (dialog)
        this.questionContainer = new Konva.Group({ x: STAGE_WIDTH / 2 - 360, y: STAGE_HEIGHT / 2 - 60 });
        this.questionDialog = new Konva.Rect({ width: 720, height: 220, cornerRadius: 12, fill: "#ffffff", opacity: 0.7, stroke: "black", strokeWidth: 2 });
        this.questionText = new Konva.Text({ x: 300, y: 30, width: 680, text: "Sample Question", fontSize: 28, fontFamily: "Arial", fill: "black", align: "center" });
        this.questionText.offsetX(this.questionText.width() / 2);
        this.questionContainer.add(this.questionDialog);
        this.questionContainer.add(this.questionText);

        // small submit button displayed inside dialog
        const submitGroup = new Konva.Group({ x: 260, y: 140 });
        const submitRect = new Konva.Rect({ width: 200, height: 44, fill: "#d9d9d9", cornerRadius: 10, stroke: "black", strokeWidth: 2 });
        const submitText = new Konva.Text({ x: 100, y: 10, text: "Submit", fontSize: 20, fontFamily: "Arial", fill: "black" });
        submitText.offsetX(submitText.width() / 2);
        submitGroup.add(submitRect);
        submitGroup.add(submitText);
        submitGroup.on("click", () => {
            if (this.answerInput && this.onSubmit) {
                this.onSubmit(this.answerInput.value);
            }
        });
        submitGroup.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        submitGroup.on("mouseleave", () => (document.body.style.cursor = "default"));
        this.questionContainer.add(submitGroup);

        // small red X button in the top-left of the dialog to go back to pick screen
        this.backX = new Konva.Group({ x: 20, y: 10 });
        const bxRect = new Konva.Rect({ width: 48, height: 48, fill: '#D32F2F', cornerRadius: 8, stroke: 'black', strokeWidth: 2 });
        const bxText = new Konva.Text({ x: 24, y: 6, text: '✕', fontSize: 28, fontFamily: 'Arial', fill: 'white' });
        bxText.offsetX(bxText.width() / 2);
        this.backX.add(bxRect);
        this.backX.add(bxText);
        this.backX.on('click tap', () => {
            if (this.onBack) this.onBack();
        });
        this.backX.on('mouseenter', () => (document.body.style.cursor = 'pointer'));
        this.backX.on('mouseleave', () => (document.body.style.cursor = 'default'));
        // add to question container so it sits over the dialog
        this.questionContainer.add(this.backX);

        this.group.add(this.questionContainer);

        // feedback boxes (hidden by default)
        this.correctBox = new Konva.Group({ x: 40, y: 110, visible: false });
        const cRect = new Konva.Rect({ width: 48, height: 48, fill: "#4CAF50", cornerRadius: 8, stroke: "black", strokeWidth: 2 });
        const cText = new Konva.Text({ x: 24, y: 6, text: "✓", fontSize: 36, fontFamily: "Arial", fill: "white" });
        cText.offsetX(cText.width() / 2);
        this.correctBox.add(cRect);
        this.correctBox.add(cText);
        this.group.add(this.correctBox);

        this.wrongBox = new Konva.Group({ x: 40, y: 110, visible: false });
        const wRect = new Konva.Rect({ width: 48, height: 48, fill: "#D32F2F", cornerRadius: 8, stroke: "black", strokeWidth: 2 });
        const wText = new Konva.Text({ x: 24, y: 6, text: "✕", fontSize: 30, fontFamily: "Arial", fill: "white" });
        wText.offsetX(wText.width() / 2);
        this.wrongBox.add(wRect);
        this.wrongBox.add(wText);
        this.group.add(this.wrongBox);

        this.invalidBox = new Konva.Group({ x: 40, y: 110, visible: false });
        const iRect = new Konva.Rect({ width: 48, height: 48, fill: "#FFA000", cornerRadius: 8, stroke: "black", strokeWidth: 2 });
        const iText = new Konva.Text({ x: 24, y: 6, text: "!", fontSize: 30, fontFamily: "Arial", fill: "white" });
        iText.offsetX(iText.width() / 2);
        this.invalidBox.add(iRect);
        this.invalidBox.add(iText);
        this.group.add(this.invalidBox);

        // results modal
        this.resultsGroup = new Konva.Group({ visible: false });
        const resultsBg = new Konva.Rect({ x: STAGE_WIDTH / 2 - 500, y: STAGE_HEIGHT / 2 - 250, width: 1000, height: 500, fill: "#2b2b2bff", opacity: 0.95, cornerRadius: 12, stroke: "black", strokeWidth: 2 });
        const resultsText = new Konva.Text({ x: STAGE_WIDTH / 2 - 500 + 200, y: STAGE_HEIGHT / 2 - 250 + 100, width: 400, text: "Time's up!", fontSize: 40, fontFamily: "Arial", fill: "#ffffff", align: "center" });
        resultsText.offsetX(resultsText.width() / 2);
        const restartGroup = new Konva.Group({ x: STAGE_WIDTH / 2 - 170, y: STAGE_HEIGHT / 2 + 170 });
        const restartRect = new Konva.Rect({ width: 140, height: 48, fill: "#cee353", cornerRadius: 10, stroke: "darkgreen", strokeWidth: 3 });
        const restartText = new Konva.Text({ x: 70, y: 12, text: "Restart", fontSize: 18, fontFamily: "Arial", fill: "black" });
        restartText.offsetX(restartText.width() / 2);
        restartGroup.add(restartRect);
        restartGroup.add(restartText);
        restartGroup.on("click", () => {
            if (this.restart) this.restart();
        });
        restartGroup.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        restartGroup.on("mouseleave", () => (document.body.style.cursor = "default"));

        const exitGroup = new Konva.Group({ x: STAGE_WIDTH / 2 + 30, y: STAGE_HEIGHT / 2 + 170 });
        const exitRect = new Konva.Rect({ width: 140, height: 48, fill: "#ff6b6b", cornerRadius: 10, stroke: "darkred", strokeWidth: 2 });
        const exitText = new Konva.Text({ x: 70, y: 12, text: "Exit", fontSize: 18, fontFamily: "Arial", fill: "black" });
        exitText.offsetX(exitText.width() / 2);
        exitGroup.add(exitRect);
        exitGroup.add(exitText);
        exitGroup.on("click", () => {
            if (this.onCompleteExit) this.onCompleteExit();
        });
        exitGroup.on("mouseenter", () => (document.body.style.cursor = "pointer"));
        exitGroup.on("mouseleave", () => (document.body.style.cursor = "default"));

        this.resultsGroup.add(resultsBg);
        this.resultsGroup.add(resultsText);
        this.resultsGroup.add(restartGroup);
        this.resultsGroup.add(exitGroup);
        this.group.add(this.resultsGroup);

        // create DOM input container (hidden until shown)
        this.createInputElements();

        // make sure layer draws when show/hide
        this.group.on("show", () => {
            if (this.inputContainer) this.inputContainer.style.display = "block";
            this.group.getLayer()?.draw();
        });
        this.group.on("hide", () => {
            if (this.inputContainer) this.inputContainer.style.display = "none";
            this.group.getLayer()?.draw();
        });
    }

    private createInputElements(): void {
        this.inputContainer = document.createElement("div");
        document.body.appendChild(this.inputContainer);
        this.inputContainer.style.position = "absolute";
        this.inputContainer.style.left = "50%";
        this.inputContainer.style.transform = "translateX(-50%)";
        this.inputContainer.style.zIndex = "5";
        this.inputContainer.style.display = "none";

        this.answerInput = document.createElement("input");
        this.answerInput.type = "text";
        this.answerInput.placeholder = "Enter answer...";
        this.answerInput.style.padding = "10px";
        this.answerInput.style.width = "400px";
        this.answerInput.style.fontSize = "18px";
        this.answerInput.style.borderRadius = "8px";
        this.answerInput.style.border = "2px solid #ccc";

        // Submit using Enter key
        this.answerInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                if (this.onSubmit && this.answerInput) this.onSubmit(this.answerInput.value);
            }
        });

        this.inputContainer.appendChild(this.answerInput);

        // position it relative to stage coordinates
        const screenX = (STAGE_WIDTH / 2) + "px";
        const screenY = (STAGE_HEIGHT / 2 - 50) + "px";
        this.inputContainer.style.top = screenY;
    }

    showRoom(level: "easy" | "medium" | "hard" | null): void {
        // load the background image (same asset used, tint applied for level)
        Konva.Image.fromURL("/levelBackdrop.png", (img) => {
            img.width(STAGE_WIDTH);
            img.height(STAGE_HEIGHT);
            this.background = img;
            this.group.add(img);
            img.moveToBottom();

            // tint depending on level
            if (this.tintRect) this.tintRect.destroy();
            let color = "rgba(0,0,0,0)";
            if (level === "easy") color = "rgba(40,120,40,0.25)";
            if (level === "medium") color = "rgba(180,160,60,0.25)";
            if (level === "hard") color = "rgba(160,40,40,0.25)";
            this.tintRect = new Konva.Rect({ x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, fill: color });
            // don't let the tint capture pointer events - allow clicks to reach UI elements
            this.tintRect.listening(false);
            this.group.add(this.tintRect);
            this.group.getLayer()?.draw();
        });

        // show main UI
        this.showBackground();
        this.barFront?.width(0);
        this.pointText?.text("Points: 0");
        this.questionTextTop?.text("Question 0");
    }

    showCorrectBox(): void {
        this.correctBox?.show();
    }
    hideCorrectBox(): void {
        this.correctBox?.hide();
    }

    showWrongBox(): void {
        this.wrongBox?.show();
    }
    hideWrongBox(): void {
        this.wrongBox?.hide();
    }

    showInvalidBox(): void {
        this.invalidBox?.show();
    }
    hideInvalidBox(): void {
        this.invalidBox?.hide();
    }

    showBackground(): void {
        this.background?.show();
        this.group.getLayer()?.draw();
    }

    showQuestionContainer(question: Question | null): void {
        if (!question) return;
        this.questionText!.text(question.question || "");
        // center text
        // ensure input cleared
        if (this.answerInput) this.answerInput.value = "";
        // ensure input visible
        if (this.inputContainer) this.inputContainer.style.display = "block";
        this.group.getLayer()?.draw();
    }

    showBar(): void {
        this.barBack?.show();
        this.barFront?.show();
    }

    showPointNum(pointNum: number): void {
        this.pointText!.text(`Points: ${pointNum}`);
    }

    showQuestionNum(questionNum: number): void {
        this.questionTextTop!.text(`Question ${questionNum}`);
    }

    updateProgress(time: number | null, time2: number): void {
        if (time === null) return;
        const ratio = Math.max(0, Math.min(1, time / time2));
        const full = (this.barBack?.width() as number) || (STAGE_WIDTH - 80);
        this.barFront!.width(full * ratio);
        this.group.getLayer()?.draw();
    }

    showResultsBox(): void {
        // bring results modal to the top of the Konva layer and show it
        this.resultsGroup?.moveToTop();
        this.resultsGroup?.show();
        // also hide DOM input so it cannot appear above the canvas
        if (this.inputContainer) this.inputContainer.style.display = "none";
        this.group.getLayer()?.draw();
    }

    hideResultsBox(): void {
        this.resultsGroup?.hide();
        // restore input visibility when hiding results
        if (this.inputContainer) this.inputContainer.style.display = "block";
        this.group.getLayer()?.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
    show(): void {
        this.group.show();
        this.group.getLayer()?.draw();
        this.group.fire("show");
    }
    hide(): void {
        this.group.hide();
        this.group.getLayer()?.draw();
        this.group.fire("hide");
    }

}