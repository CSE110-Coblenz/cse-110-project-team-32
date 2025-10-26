import Konva from "konva";
import type { View } from "../../types.ts";
import {STAGE_WIDTH, STAGE_HEIGHT} from "../../constants.ts";

export class GameScreenView implements View {
    private group: Konva.Group;
    
    constructor(){

    }

    /*
    show the screen
    */
    show(): void{

    }

    /*
    hide the screen
    */
    hide(): void{

    }

    
    getGroup(): Konva.Group {
        return this.group;
    }


}