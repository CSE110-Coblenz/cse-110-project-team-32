import type { ScreenSwitcher, View } from "../../types"
import { ScreenController } from "../../types";
import { HomeScreenView } from "./HomeScreenView";
import { User } from "../../core/models/User";
import { UserService } from "../../core/Services/UserService";
import { HomeScreenModel } from "./HomeScreenModel";
import Konva from "konva";

export class HomeScreenController extends ScreenController {
  private view: HomeScreenView;
  private model: HomeScreenModel;
  private screenSwitcher: ScreenSwitcher;
  private user!: User;
  private userId: string;
  private layer: Konva.Layer;

  constructor(screenSwitcher: ScreenSwitcher, userId: string, layer: Konva.Layer) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new HomeScreenView();
    this.model = new HomeScreenModel();
    this.userId = userId;
    this.layer = layer;
  }

  init(){
    console.log("initialising homescreen");

    this.model.setCurrentLevel();
    this.model.setMiniGames();

    this.view.CreateView(this.userId, this.model.getCurrLevel(), this.model.getMiniGames());
    this.layer.add(this.view.getGroup());
    this.layer.draw();
    this.view.show();
  }

  getView(): View {
    return this.view;
  }
}