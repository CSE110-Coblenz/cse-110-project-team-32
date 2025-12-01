import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";

export class Minigame2Entrance2ScreenView implements View {
    showBackSquare() {
        throw new Error("Method not implemented.");
    }
    private group: Konva.Group;

    private background?: Konva.Image;

    // Buttons
    private easyButton: Konva.Group;
    private medButton: Konva.Group;
    private hardButton: Konva.Group;

    // Title text
    private title: Konva.Text;

    onSelectEasy?: () => void;
    onSelectMedium?: () => void;
    onSelectHard?: () => void;
    onRandomButtonClick: (() => void) | undefined;

    constructor() {
        this.group = new Konva.Group({ visible: false });

        // --------------------------
        // BACKGROUND
        // --------------------------
        Konva.Image.fromURL("/Minigame_2_entrance2.jpg", (bg: Konva.Image) => {
            bg.width(STAGE_WIDTH);
            bg.height(STAGE_HEIGHT);
            this.background = bg;
            this.group.add(bg);
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
            350,
            450,
            "#46799B",
            "Easy",
            () => this.onSelectEasy?.()
        );
        this.group.add(this.easyButton);

        // --------------------------
        // MED BUTTON
        // --------------------------
        this.medButton = this.makeButton(
            780,
            450,
            "#D0CC54",
            "Medium",
            () => this.onSelectMedium?.()
        );
        this.group.add(this.medButton);

        // --------------------------
        // HARD BUTTON
        // --------------------------
        this.hardButton = this.makeButton(
            1210,
            450,
            "#B1442F",
            "Hard",
            () => this.onSelectHard?.()
        );
        this.group.add(this.hardButton);
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
            text: label,
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
        this.group.visible(true);
    }

    hide() {
        this.group.visible(false);
    }

    getGroup(): Konva.Group {
        return this.group;
    }

    // Called by controller when screen loads
    showBackground() {
        this.background?.show();
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