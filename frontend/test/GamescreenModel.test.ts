import { describe, it, expect, vi, beforeEach } from "vitest";
import { GameScreenModel } from "../src/screens/GameScreen/GameScreenModel";
import { userStore } from "../src/context/UserState";

// Mock userStore
vi.mock("../src/context/UserState", () => ({
  userStore: {
    incrementLevel: vi.fn(),
    getState: vi.fn(() => ({ username: "testuser", currLevel: 1 })),
    getCurrLevel: vi.fn(() => 1), 
  },
}));

// Mock fetch globally
(globalThis.fetch as any) = vi.fn();

describe("GameScreenModel", () => {
  let model: GameScreenModel;
  const regularQuestions = [
    { question: "Q1", answer: "A1", isTest: false },
    { question: "Q2", answer: "A2", isTest: false },
  ];
  const testQuestion = { question: "TestQ", answer: "TestA", isTest: true };

  beforeEach(() => {
    model = new GameScreenModel(1);
    vi.clearAllMocks();
  });

  /**
   * tests initialization
   */
  it("initializes correctly", () => {
    expect(model.getLevel()).toBe(1);
    expect(model.getUsername()).toBe("");
    expect(model.getCurrentQuestion()).toBeNull();
    expect(model.getTotalQuestions()).toBe(0);
    expect(model.getTestTries()).toBe(3);
  });

  /**
   * tests set and get username functions
   */
  it("can set and get username", () => {
    model.setUsername("ridhi");
    expect(model.getUsername()).toBe("ridhi");
  });

  /**
   * tests loadQuestions, set and restarts state
   */
  it("loadQuestions sets questions and resets state", async () => {
    (fetch as any)
      .mockResolvedValueOnce({ json: async () => regularQuestions })
      .mockResolvedValueOnce({ json: async () => testQuestion });

    const questions = await model.loadQuestions();
    expect(questions.length).toBe(3);
    expect(model.getCurrentQuestionIndex()).toBe(0);
    expect(model.getTotalQuestions()).toBe(3);
    expect(model.getTotalPracticeQuestions()).toBe(2);
    expect(model.getTestTries()).toBe(3);
    expect(model.isTestQuestion()).toBe(false);
  });

  /**
   * tests if getNextQuestion navigates correctly
   */
  it("getNextQuestion navigates correctly", async () => {
    (fetch as any)
      .mockResolvedValueOnce({ json: async () => regularQuestions })
      .mockResolvedValueOnce({ json: async () => null });
    await model.loadQuestions();

    expect(model.getCurrentQuestionIndex()).toBe(0);
    model.getNextQuestion();
    expect(model.getCurrentQuestionIndex()).toBe(1);
    model.getNextQuestion();
    expect(model.getNextQuestion()).toBeNull(); // reached end
  });

  /**
   * tests if checkAnswer works correctly in all cases
   */
  it("checkAnswer returns next / complete / wrong / restart correctly", async () => {
    (fetch as any)
      .mockResolvedValueOnce({ json: async () => regularQuestions })
      .mockResolvedValueOnce({ json: async () => testQuestion });
    await model.loadQuestions();

    // Correct answer for first question
    expect(model.checkAnswer("A1")).toBe("next");
    // Wrong answer for second question (practice)
    expect(model.checkAnswer("wrong")).toBe("wrong");

    // Move to test question
    model.getNextQuestion();
    expect(model.isTestQuestion()).toBe(true);

    // wrong tries
    expect(model.checkAnswer("wrong")).toBe("wrong");
    expect(model.getTestTries()).toBe(2);
    expect(model.checkAnswer("wrong")).toBe("wrong");
    expect(model.getTestTries()).toBe(1);
    expect(model.checkAnswer("wrong")).toBe("restart"); // reset
    expect(model.getCurrentQuestionIndex()).toBe(0);
    expect(model.getTestTries()).toBe(3);

    // correct answer on last question triggers complete
    model.setCurrentQuestionIndex(model.getTotalQuestions() - 1);
    expect(await model.checkAnswer("TestA")).toBe("complete");
  });

  /**
   * tests reset level -> sets level and clears questions
   */
  it("reset sets level and clears questions", () => {
    model.reset(2);
    expect(model.getLevel()).toBe(2);
    expect(model.getTotalQuestions()).toBe(0);
    expect(model.getCurrentQuestionIndex()).toBe(0);
  });

  /**
   * tests if incrementUserLevel calls userStore and updates the backend
   */
  it("incrementUserLevel calls userStore and updates backend", async () => {
    (fetch as any).mockResolvedValue({});

    await model.incrementUserLevel();

    expect(userStore.incrementLevel).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/user/username/testuser",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })
    );
  });
});
