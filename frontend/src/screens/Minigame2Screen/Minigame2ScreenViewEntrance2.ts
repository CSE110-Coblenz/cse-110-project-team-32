import Konva from "konva";
import type { View } from "../../types";
import { CONTENT_HEIGHT, CONTENT_WIDTH, STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import type { Question } from "../../types";
import type { Group } from "konva/lib/Group";

export class Minigame2Entrance2ScreenView implements View {
    
    private group = new Konva.Group;

    onRandomButtonClick?: () => void;

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