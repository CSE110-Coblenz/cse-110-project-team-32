import { describe, it, expect, vi, beforeEach } from "vitest";
import { GameScreenController } from "../../../frontend/src/screens/GameScreen/GameScreenController";
import { GameScreenModel } from "../../../frontend/src/screens/GameScreen/GameScreenModel";
import { GameScreenView } from "../../../frontend/src/screens/GameScreen/GameScreenView";

// Mock dependencies
const mockModelMethods = {
  setLevel: vi.fn(),
  loadQuestions: vi.fn().mockResolvedValue([]),
  getCurrentQuestion: vi.fn(),
  getCurrentQuestionIndex: vi.fn(),
  getTotalPracticeQuestions: vi.fn(),
  getTotalQuestions: vi.fn(),
  getTestTries: vi.fn(),
  checkAnswer: vi.fn(),
  reset: vi.fn(),
  getLevel: vi.fn().mockReturnValue(1),
};

const mockViewMethods = {
  show: vi.fn(),
  updateQuestion: vi.fn(),
  updateProgress: vi.fn(),
  updateFeedBack: vi.fn(),
  resetHint: vi.fn(),
  showComplete: vi.fn(),
  hideComplete: vi.fn(),  
  updateHint: vi.fn(),
  hideFeedBack: vi.fn(),
  showFeedBack: vi.fn(),
  updateLevel: vi.fn(),
  initializeAnswer: vi.fn(),
  resetProgress: vi.fn(),
};

vi.mock("../../../frontend/src/screens/GameScreen/GameScreenModel", () => ({
  GameScreenModel: vi.fn(() => mockModelMethods),
}));

vi.mock("../../../frontend/src/screens/GameScreen/GameScreenView", () => ({
  GameScreenView: vi.fn(() => mockViewMethods),
}));

describe("GameScreenController", () => {
  let controller: GameScreenController;
  const mockSwitcher = { switchToScreen: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new GameScreenController(mockSwitcher as any);
  });

  /**
   * tests if startGame sets level, loads questions, and updates view
   */
  it("startGame sets level, loads questions, and updates view", async () => {
    mockModelMethods.getCurrentQuestion.mockReturnValue({ question: "q1", hint: "hint1" });
    mockModelMethods.getCurrentQuestionIndex.mockReturnValue(0);
    mockModelMethods.getTotalPracticeQuestions.mockReturnValue(0);
    mockModelMethods.getTestTries.mockReturnValue(3);

    await controller.startGame(2);

    expect(mockModelMethods.setLevel).toHaveBeenCalledWith(2);
    expect(mockModelMethods.loadQuestions).toHaveBeenCalled();
    expect(mockViewMethods.updateQuestion).toHaveBeenCalled();
    expect(mockViewMethods.updateLevel).toHaveBeenCalled();
    expect(mockViewMethods.show).toHaveBeenCalled();
  });

  /**
   * tests handleAnswer for next
   */
  it("handleAnswer calls correct view methods for 'next'", () => {
    mockModelMethods.checkAnswer.mockReturnValue("next");
    mockModelMethods.getCurrentQuestion.mockReturnValue({ question: "q" });
    mockModelMethods.getCurrentQuestionIndex.mockReturnValue(1);
    mockModelMethods.getTotalPracticeQuestions.mockReturnValue(3);
    mockModelMethods.getTestTries.mockReturnValue(3);

    controller.handleAnswer("answer");

    expect(mockViewMethods.updateFeedBack).toHaveBeenCalled();
    expect(mockViewMethods.updateQuestion).toHaveBeenCalled();
    expect(mockViewMethods.updateProgress).toHaveBeenCalled();
    expect(mockViewMethods.resetHint).toHaveBeenCalled();
    expect(mockViewMethods.showFeedBack).toHaveBeenCalled();
  });

  /**
   * tests handleAnswer for wrong 
   */
  it("handleAnswer calls correct view methods for 'wrong'", () => {
    mockModelMethods.checkAnswer.mockReturnValue("wrong");
    mockModelMethods.getCurrentQuestion.mockReturnValue({ question: "q" });
    mockModelMethods.getCurrentQuestionIndex.mockReturnValue(0);
    mockModelMethods.getTotalPracticeQuestions.mockReturnValue(1);
    mockModelMethods.getTestTries.mockReturnValue(3);

    controller.handleAnswer("answer");

    expect(mockViewMethods.updateFeedBack).toHaveBeenCalledWith(0);
    expect(mockViewMethods.updateQuestion).toHaveBeenCalled();
    expect(mockViewMethods.showFeedBack).toHaveBeenCalled();
  });

  /**
   * tests handleAnswer for restart
   */
  it("handleAnswer calls correct view methods for 'restart'", async () => {
    mockModelMethods.checkAnswer.mockReturnValue("restart");
    mockModelMethods.getCurrentQuestion.mockReturnValue({ question: "q" });
    mockModelMethods.getCurrentQuestionIndex.mockReturnValue(0);
    mockModelMethods.getTotalPracticeQuestions.mockReturnValue(1);
    mockModelMethods.getTestTries.mockReturnValue(3);

    await controller.handleAnswer("answer");

    expect(mockModelMethods.loadQuestions).toHaveBeenCalled();
    expect(mockViewMethods.updateQuestion).toHaveBeenCalled();
    expect(mockViewMethods.updateProgress).toHaveBeenCalled();
    expect(mockViewMethods.resetHint).toHaveBeenCalled();
    expect(mockViewMethods.updateFeedBack).toHaveBeenCalledWith(3);
  });

  /**
   * tests handleAnswer for complete
   */
  it("handleAnswer calls correct view methods for 'complete'", () => {
    mockModelMethods.checkAnswer.mockReturnValue("complete");
    mockModelMethods.getTotalQuestions.mockReturnValue(5);

    controller.handleAnswer("answer");

    expect(mockViewMethods.updateFeedBack).toHaveBeenCalledWith(1);
    expect(mockViewMethods.updateProgress).toHaveBeenCalledWith(5, 5);
    expect(mockViewMethods.resetHint).toHaveBeenCalled();
  });

  /**
   * tests handleHint updates the hint in view
   */
  it("handleHint updates hint in view", () => {
    mockModelMethods.getCurrentQuestion.mockReturnValue({ hint: "test hint" });

    controller.handleHint();
    expect(mockViewMethods.updateHint).toHaveBeenCalledWith("Hint: test hint");
  });

  /**
   * tests handleReset resets model abd updates view
   */
  it("handleReset resets model and updates view", async () => {
    mockModelMethods.getCurrentQuestion.mockReturnValue({ question: "q" });
    mockModelMethods.getCurrentQuestionIndex.mockReturnValue(0);
    mockModelMethods.getTotalPracticeQuestions.mockReturnValue(1);
    mockModelMethods.getTestTries.mockReturnValue(3);

    await controller.handleReset();

    expect(mockModelMethods.reset).toHaveBeenCalled();
    expect(mockModelMethods.loadQuestions).toHaveBeenCalled();
    expect(mockViewMethods.updateQuestion).toHaveBeenCalled();
    expect(mockViewMethods.updateProgress).toHaveBeenCalled();
    expect(mockViewMethods.resetHint).toHaveBeenCalled();
  });

  /**
   * tests if exit callback switches screen to home
   */
  it("exit callback switches screen to home", () => {
    controller.getView().onExit?.();
    expect(mockSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    expect(mockViewMethods.resetHint).toHaveBeenCalled();
    expect(mockViewMethods.hideComplete).toHaveBeenCalled();
  });
});
