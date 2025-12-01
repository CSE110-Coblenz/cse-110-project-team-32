import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";

export class Minigame2Entrance2ScreenView implements View {
    //showBackSquare() {
    //    throw new Error("Method not implemented.");
    //}
    private group: Konva.Group;

    private background!: Konva.Image;

    // Buttons
    private easyButton: Konva.Group;
    private medButton: Konva.Group;
    private hardButton: Konva.Group;
    private backSquare: Konva.Group;

    // Title text
    private title: Konva.Text;
    // progress bar
    private barBack?: Konva.Rect;
    private barFront?: Konva.Rect;

    // results modal
    private resultsGroup?: Konva.Group;

    // callbacks for results
    restart?: () => void;
    onPartialExit?: () => void;
    onCompleteExit?: () => void;
    onRandomButtonClick!: () => void;

    onSelectDifficulty?: (d: "easy" | "medium" | "hard") => void;
    onBack?: () => void;

    constructor() {
        this.group = new Konva.Group({ visible: false });

        // --------------------------
        // BACKGROUND
        // --------------------------
        Konva.Image.fromURL("/Minigame_2_entrance.jpg", (bg: Konva.Image) => {
            this.background = bg;
            bg.width(STAGE_WIDTH);
            bg.height(STAGE_HEIGHT);
            this.group.add(bg);
            bg.moveToBottom();
        });

        // --------------------------
        // TITLE
        // --------------------------
        this.title = new Konva.Text({
            x: 0,
            y: 140,
            width: STAGE_WIDTH,
            align: "center",
            text: "Pick a button",
            fontSize: 64,
            fontFamily: "Rag 123",
            fill: "white",
        });
        this.group.add(this.title);

        // --------------------------
        // EASY BUTTON
        // --------------------------
        this.easyButton = this.makeButton(
            STAGE_WIDTH * 0.25 - 100,
            450,
            "#46799B",
            "Button 1",
            //() => this.onSelectDifficulty?.("easy")
            () => this.onRandomButtonClick()
        );
        this.group.add(this.easyButton);

        // --------------------------
        // MED BUTTON
        // --------------------------
        this.medButton = this.makeButton(
            STAGE_WIDTH * 0.5 - 100,
            450,
            "#D0CC54",
            "Button 2",
            //() => this.onSelectDifficulty?.("medium")
            () => this.onRandomButtonClick()
        );
        this.group.add(this.medButton);

        // --------------------------
        // HARD BUTTON
        // --------------------------
        this.hardButton = this.makeButton(
            STAGE_WIDTH * 0.75 - 100,
            450,
            "#B1442F",
            "Button 3",
            //() => this.onSelectDifficulty?.("hard")
            () => this.onRandomButtonClick()
        );
        this.group.add(this.hardButton);

        // --------------------------
        // BACK SQUARE (small decorative button using makeButton)
        // --------------------------
        this.backSquare = this.makeButton(
            50,
            150,
            '#ffffff',
            'Back',
            () => this.onBack?.()
        );

        // // shrink and restyle the returned button so it looks like the small back square
        // const backRect = this.backSquare.findOne('Rect') as Konva.Rect | null;
        // const backText = this.backSquare.findOne('Text') as Konva.Text | null;
        // if (backRect) {
        //     backRect.width(120);
        //     backRect.height(80);
        //     // smaller corner radius and semi-transparent background like original
        //     // @ts-ignore cornerRadius exists
        //     backRect.cornerRadius(10);
        //     backRect.fill('#ffffff');
        //     backRect.opacity(0.6);
        // }
        // if (backText && backRect) {
        //     backText.fontSize(28);
        //     backText.fill('black');
        //     backText.width(backRect.width());
        //     backText.height(backRect.height());
        //     backText.y(backRect.height() / 2 - backText.height() / 2);
        // }

        this.group.add(this.backSquare);

        // progress bar (same style as room)
        this.barBack = new Konva.Rect({
            x: 40,
            y: 70,
            width: STAGE_WIDTH - 80,
            height: 24,
            fill: "#e0e0e0",
            cornerRadius: 8,
            opacity: 0.9,
            visible: false,
        });
        this.barFront = new Konva.Rect({
            x: 40,
            y: 70,
            width: 0,
            height: 24,
            fill: "#3fb23f",
            cornerRadius: 8,
            visible: false,
        });
        this.group.add(this.barBack);
        this.group.add(this.barFront);

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
    }

    // Creates a single standard button
    private makeButton(
        x: number,
        y: number,
        color: string,
        label: string,
        callback: () => void,
    ): Konva.Group {
        const group = new Konva.Group({ x, y });

        const rect = new Konva.Rect({
            width: 240,
            height: 120,
            cornerRadius: 30,
            fill: color,
            stroke: "black",
            strokeWidth: 3,
        });

        const text = new Konva.Text({
            text: label || '',
            width: rect.width(),
            height: rect.height(),
            fontSize: 42,
            fontFamily: "Rag 123",
            fill: "black",
            align: "center",
            verticalAlign: "middle",
        });

        group.add(rect);
        group.add(text);

        group.on("click tap", () => callback());

        group.on("mouseenter", () => {
            rect.opacity(0.8);
            document.body.style.cursor = "pointer";
        });

        group.on("mouseleave", () => {
            rect.opacity(1.0);
            document.body.style.cursor = "default";
        });

        return group;
    }

    // Required by View interface
    show() {
        this.group.show();
    }

    hide() {
        this.group.hide();
    }

    getGroup(): Konva.Group {
        return this.group;
    }

    // Called by controller when screen loads
    showBackground() {
        this.background?.show();
    }

    showBackSquare() {
        this.backSquare.show();
    }

    showBar() {
        this.barBack?.show();
        this.barFront?.show();
    }

    updateProgress(time: number | null, maxTime: number) {
        if (time === null) return;
        const ratio = Math.max(0, Math.min(1, time / maxTime));
        const full = (this.barBack?.width() as number) || (STAGE_WIDTH - 80);
        this.barFront!.width(full * ratio);
        this.group.getLayer()?.draw();
    }

    showResultsBox(): void {
        // ensure results modal is on top of other Konva content
        this.resultsGroup?.moveToTop();
        this.resultsGroup?.show();
        this.group.getLayer()?.draw();
    }

    hideResultsBox(): void {
        this.resultsGroup?.hide();
    }

    showButton1() {
        this.easyButton.show();
    }

    showButton2() {
        this.medButton.show();
    }

    showButton3() {
        this.hardButton.show();
    }

    showText() {
        this.title.show();
    }
}