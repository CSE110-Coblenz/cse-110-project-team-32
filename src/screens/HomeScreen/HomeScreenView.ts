import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH } from "../../constants";

export class HomeScreenView implements View {
  private group: Konva.Group;

  constructor() {
    // Create a simple empty Konva group for now
    this.group = new Konva.Group({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
    });

    console.log("HomeScreenView initialized");
  }

  show(): void {
    console.log("Showing Home Screen");
  }

  hide(): void {
    console.log("Hiding Home Screen");
  }

  getGroup(): Konva.Group {
    console.log("Returning HomeScreen group");
    return this.group;
  }
}
