import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";

export class Minigame2RoomScreenView implements View {
    
    private group = new Konva.Group;

    showRoom?: (level: "easy" | "medium" | "hard" | null) => void;

    onSubmit?: (answer: String) => void;


    showCorrectBox(): void {

    }

    hideCorrectBox(): void {

    }

    showWrongBox(): void {

    }

    hideWrongBox(): void {
        
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