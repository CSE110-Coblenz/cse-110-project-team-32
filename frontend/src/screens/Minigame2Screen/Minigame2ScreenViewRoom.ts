import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";

export class Minigame2RoomScreenView implements View {
    
    private group = new Konva.Group;


    onSubmit?: (answer: String) => void;

    restart?: () => void;

    onPartialExit?: () => void;

    showRoom(level: "easy" | "medium" | "hard" | null): void {
        
    }

    showCorrectBox(): void {

    }

    hideCorrectBox(): void {

    }

    showWrongBox(): void {

    }

    hideWrongBox(): void {

    }

    showInvalidBox(): void {

    }

    hideInvalidBox(): void {

    }

    showBackground(): void {

    }

    showQuestionContainer(question: Question | null): void {

    }

    showBar(): void {

    }

    showPointNum(pointNum: number): void {

    }

    showQuestionNum(questionNum: number): void {

    }

    updateProgress(time: number | null, time2: number): void {

    }

    showResultsBox(): void {

    }

    getGroup(): Konva.Group {
        return this.group;
    }
    show(): void {
        this.group.show();
    }
    hide(): void {
        this.group.hide();
    }

}