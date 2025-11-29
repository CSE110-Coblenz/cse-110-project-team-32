import { describe, it, expect, vi } from "vitest";
import { Minigame1ScreenController } from "../src/screens/Minigame1Screen/Minigame1ScreenController";

/**
 * Test if the startGame() call model.rest()
 * Test if handleAnswer() calls the correct view methods for 'next', 'wrong', and 'restart'
 * Test the controller call view function when needed
 * Test if the screen switched works correctly
 * 
 */

//Fake model and view classes
const { FakeModel, FakeView } = vi.hoisted(() => {
  class FakeModel {
    reset = vi.fn();
    getSequence = vi.fn(() => [1, 2, 3, 4, 5]);
    checkAnswer = vi.fn().mockReturnValue(true);
    incrementCorrect = vi.fn();
    getIsWin = vi.fn(() => false);
    getTotalCorrect = vi.fn(() => 3);
    getTimeLeft = vi.fn(() => 10);
    reduceTime = vi.fn();
    getIsGameOver = vi.fn(() => false);
    setGameOver = vi.fn();
  }

  class FakeView {
    constructor() {}

    hideFeedback = vi.fn();
    hideGameOver = vi.fn();
    hideGameWin = vi.fn();
    getGroup = vi.fn(() => ({
      findOne: vi.fn(() => ({ on: vi.fn() }))
    }));
    showQuestionBox = vi.fn();
    hideIntro = vi.fn();
    displayQuestion = vi.fn();
    updateTime = vi.fn();
    updateCorrect = vi.fn();
    updateFeedback = vi.fn();
    showFeedback = vi.fn();
    hideHTML = vi.fn();
    updateInput = vi.fn();
    showGameWin = vi.fn();
    showGameOver = vi.fn();
    hideQuestionBox = vi.fn();

    onSubmit = () => {};
    onExit = () => {};
    onTryAgain = () => {};
  }

  return { FakeModel, FakeView };
});

// replace actual Model and View with fakes
// inject fakes into controller
vi.mock("../src/screens/Minigame1Screen/Minigame1ScreenModel", () => ({
  Minigame1ScreenModel: FakeModel
}));

vi.mock("../src/screens/Minigame1Screen/Minigame1ScreenView", () => ({
  Minigame1ScreenView: FakeView
}));

// Mock Konva Layer
vi.mock("konva", () => ({
  Layer: class {}
}));

//Test controller

describe("Minigame1ScreenController (simple test)", () => {
  const fakeSwitcher = { switchToScreen: vi.fn() };

  it("startGame() calls model.reset() and displays first question", () => {
    const controller = new Minigame1ScreenController(fakeSwitcher as any, {} as any);

    const fakeModel = (controller as any).model;
    const fakeView = (controller as any).view;

    controller.startGame();

    expect(fakeModel.reset).toHaveBeenCalled();
    expect(fakeModel.getSequence).toHaveBeenCalled();
    expect(fakeView.displayQuestion).toHaveBeenCalled();
  });

  it("handleAnswer() calls model.checkAnswer", () => {
    const controller = new Minigame1ScreenController(fakeSwitcher as any, {} as any);

    const fakeModel = (controller as any).model;

    controller.handleAnswer("10");

    expect(fakeModel.checkAnswer).toHaveBeenCalledWith(10);
  });
});