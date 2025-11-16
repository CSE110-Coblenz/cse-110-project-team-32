import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
import Konva from "konva";

import { Minigame1ScreenView } from "./Minigame1ScreenView";
import { Minigame1ScreenModel } from "./Minigame1ScreenModel";

export class Minigame1ScreenController extends ScreenController {
  private view: Minigame1ScreenView;
  private model: Minigame1ScreenModel;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher, layer: Konva.Layer) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new Minigame1ScreenModel();
    this.view = new Minigame1ScreenView(layer);

    this.view.onStartClicked(() => this.handleStart());
  }

  getView() {
    return this.view;
  }

  show(): void {
    this.view.show();
  }

  hide(): void {
    this.view.hide();
  }

  startGame(): void {
    this.model.reset();
    this.view.updateScore(this.model.getScore());
  }

  private handleStart(): void {
    this.model.increaseScore();
    this.view.updateScore(this.model.getScore());
  }
}