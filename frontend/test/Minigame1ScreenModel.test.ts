import { describe, it, expect, beforeEach, vi } from "vitest";
import { Minigame1ScreenModel } from "../src/screens/Minigame1Screen/Minigame1ScreenModel";

// Fix randomness so tests are predictable
vi.spyOn(Math, "random").mockReturnValue(0.5);

describe("Minigame1ScreenModel", () => {
  let model: Minigame1ScreenModel;

  beforeEach(() => {
    model = new Minigame1ScreenModel();
  });

  it("initializes values correctly", () => {
    expect(model.getTotalCorrect()).toBe(0);
    expect(model.getTimeLeft()).toBe(60);
    expect(model.getFireSize()).toBe(1);
    expect(model.getIsGameOver()).toBe(false);
    expect(model.getIsWin()).toBe(false);
  });

  it("generateNewQuestion() creates a valid arithmetic sequence", () => {
    model.generateNewQuestion();

    const seq = model.getSequence();
    expect(seq.length).toBe(5);

    // Because Math.random() is mocked:
    // start = floor(0.5 * 9) + 1 = 5
    // step = floor(0.5 * 10) + 1 = 6
    // Expected sequence: [5, 11, 17, 23, 29]
    expect(seq).toEqual([5, 11, 17, 23, 29]);
  });

  it("checkAnswer() returns true for correct answer", () => {
    model.generateNewQuestion();

    // With mocked randomness:
    // expectedAnswer = start + 5*step = 5 + 30 = 35
    expect(model.checkAnswer(35)).toBe(true);
  });

  it("checkAnswer() returns false for wrong answer", () => {
    model.generateNewQuestion();
    expect(model.checkAnswer(999)).toBe(false);
  });

  it("incrementCorrect updates win condition after 5 correct answers", () => {
    for (let i = 0; i < 5; i++) {
      model.incrementCorrect();
    }

    expect(model.getIsGameOver()).toBe(true);
    expect(model.getIsWin()).toBe(true);
  });

  it("reduceTime decreases timeLeft and triggers game over at 0", () => {
    for (let i = 0; i < 60; i++) model.reduceTime();

    expect(model.getTimeLeft()).toBe(0);
    expect(model.getIsGameOver()).toBe(true);
    expect(model.getIsWin()).toBe(false);
  });

  it("reset() restores all initial values and generates a question", () => {
    model.incrementCorrect();
    model.reduceTime();

    model.reset();

    expect(model.getTotalCorrect()).toBe(0);
    expect(model.getTimeLeft()).toBe(60);
    expect(model.getFireSize()).toBe(1);
    expect(model.getIsGameOver()).toBe(false);
    expect(model.getIsWin()).toBe(false);
    expect(model.getSequence().length).toBe(5);
  });
});
