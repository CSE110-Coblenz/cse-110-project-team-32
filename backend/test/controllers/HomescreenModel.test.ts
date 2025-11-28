import { describe, it, expect, vi, beforeEach } from "vitest";
import { HomeScreenModel } from "../../../frontend/src/screens/HomeScreen/HomeScreenModel";

const mockUserStore = vi.hoisted(() => ({
  getState: vi.fn(() => ({
    username: "testuser",
    currLevel: 2,
  })),
}));

vi.mock("../../../frontend/src/context/UserState.ts", () => ({
  userStore: mockUserStore,
}));

vi.mock("../../../frontend/src/constants", () => ({
  MINI_GAME_NAMES: ["GameA", "GameB", "GameC"],
  MINI_GAME_UNLOCK_LEVELS: [1, 2, 3],
}));

describe("HomeScreenModel", () => {
  let model: HomeScreenModel;

  beforeEach(() => {
    model = new HomeScreenModel();
    mockUserStore.getState.mockClear();
  });


  /**
   * tests initialization
   */
  it("initializes currLevel and miniGames correctly", () => {
    model.init();

    expect(model.getCurrLevel()).toBe(2);

    const games = model.getMiniGames();
    expect(games).toEqual([
      { name: "GameA", unlockLevel: 1, unlocked: true },
      { name: "GameB", unlockLevel: 2, unlocked: true },
      { name: "GameC", unlockLevel: 3, unlocked: false },
    ]);
  });

  /**
   * tests fallback/ default level is 1
   */
  it("falls back to level 1 when currLevel is undefined", () => {
    mockUserStore.getState.mockReturnValueOnce({
      username: "testuser",
      currLevel: undefined as unknown as number,
    });

    model.init();

    expect(model.getCurrLevel()).toBe(1);

    const games = model.getMiniGames();
    expect(games.length).toBe(3);
    expect(games[0]!.unlocked).toBe(true);
    expect(games[1]!.unlocked).toBe(false);
  });

  /**
   * tests if it calls userStore.getState only once
   */
  it("calls userStore.getState exactly once", () => {
    model.init();
    expect(mockUserStore.getState).toHaveBeenCalledTimes(1);
  });

  /**
   * tests set and get Username functions
   */
  it("setUsername/getUsername works", () => {
    model.setUsername("hello");
    expect(model.getUsername()).toBe("hello");
  });

  /**
   * tests level update
   */
  it("recalculates unlock states when currLevel updates", () => {
    model.init();

    // @ts-ignore
    model.currLevel = 3;
    model.setMiniGames();

    const games = model.getMiniGames();
    expect(games.every(g => g.unlocked)).toBe(true);
  });

  /**
   * tests on minigames list initialization
   */
  it("miniGames empty before init()", () => {
    expect(model.getMiniGames()).toEqual([]);
  });
});
