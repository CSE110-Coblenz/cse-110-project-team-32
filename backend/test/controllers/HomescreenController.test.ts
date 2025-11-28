import { describe, it, expect, beforeEach, vi } from "vitest";

import { HomeScreenController } from "../../../frontend/src/screens/HomeScreen/HomeScreenController";
import { HomeScreenModel } from "../../../frontend/src/screens/HomeScreen/HomeScreenModel";
import { HomeScreenView } from "../../../frontend/src/screens/HomeScreen/HomeScreenView";
import { userStore } from "../../../frontend/src/context/UserState";

vi.mock("../../../frontend/src/screens/HomeScreen/HomeScreenView");
vi.mock("../../../frontend/src/screens/HomeScreen/HomeScreenModel");

// mock Konva.Layer
const mockLayer = {
  add: vi.fn(),
  draw: vi.fn(),
};

// mock ScreenSwitcher
const mockScreenSwitcher = {
  switchToScreen: vi.fn(),
};

describe("HomeScreenController", () => {
  let controller: HomeScreenController;
  let mockModel: any;
  let mockView: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // mock model instance
    mockModel = {
      init: vi.fn(),
      setUsername: vi.fn(),
      setMiniGames: vi.fn(),
      getUsername: vi.fn(() => "testuser"),
      getCurrLevel: vi.fn(() => 2),
      getMiniGames: vi.fn(() => [{ name: "GameA" }]),
    };

    // replace constructor with mock instance
    (HomeScreenModel as any).mockImplementation(() => mockModel);

    // mock view instance
    mockView = {
      CreateView: vi.fn(),
      getGroup: vi.fn(() => "mockGroup"),
      show: vi.fn(),
    };

    (HomeScreenView as any).mockImplementation(() => mockView);

    // mock userStore
    vi.spyOn(userStore, "getState").mockReturnValue({
      username: "testuser",
      currLevel: 2,
    });

    controller = new HomeScreenController(
      mockScreenSwitcher as any,
      mockLayer as any
    );
  });

  /**
   * tests initialization
   */
  it("initializes correctly and builds the view", () => {
    controller.init();

    expect(mockModel.setMiniGames).toHaveBeenCalled();
    expect(mockModel.setUsername).toHaveBeenCalledWith("testuser");
    expect(mockModel.init).toHaveBeenCalled();

    expect(mockView.CreateView).toHaveBeenCalledWith(
      "testuser",
      2,
      [{ name: "GameA" }]
    );

    expect(mockLayer.add).toHaveBeenCalledWith("mockGroup");
    expect(mockLayer.draw).toHaveBeenCalled();
    expect(mockView.show).toHaveBeenCalled();
  });

  /**
   * tests switching to selected level
   */
  it("switches to the selected level", () => {
    // constructor passes this handler in index 0
    const levelClickHandler =
      (HomeScreenView as any).mock.calls[0][0];

    levelClickHandler(4);

    expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
      type: "level",
      level: 4,
    });
  });

  /**
   * tests switching to minigame
   */
  it("switches to selected mini game", () => {
    const miniHandler =
      (HomeScreenView as any).mock.calls[0][2];

    miniHandler("GameA");

    expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
      type: "minigame",
      game: "GameA",
    });
  });

  /**
   * tests logout functionality
   */
  it("switches to login screen on logout", () => {
    const logoutHandler =
      (HomeScreenView as any).mock.calls[0][3];

    logoutHandler();

    expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
      type: "login",
    });
  });
});
