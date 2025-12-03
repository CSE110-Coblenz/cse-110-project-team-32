import {describe, it, expect, vi, beforeEach } from "vitest";
// import {GameScreenController} from "../src/screens/GameScreen/GameScreenController"
// import {GameScreenModel} from "../src/screens/GameScreen/GameScreenModel"
import {GameScreenView} from "../src/screens/GameScreen/GameScreenView"



describe("GameScreenView", ()=>{
    let view: GameScreenView;
    // const mockSwitcher = { switchToScreen: vi.fn() };

    const mockLayer = {
        draw: vi.fn(),
        batchDraw: vi.fn(),
    };
    const mockGroup = {
        getLayer: vi.fn().mockReturnValue(mockLayer),
        visible: vi.fn(),
    };
    const mockQuestionText={
        text: vi.fn(),
    };
    const mockQuestionBoxText={
        text: vi.fn(),
    };
    const mockProgressBar={
        width: vi.fn().mockReturnValue(200),
    };
    const mockProgressFill={
        to: vi.fn((config: any) => {
            if(config.onFinish){
                config.onFinish();
            }
        }),
        getLayer: vi.fn().mockReturnValue(mockLayer),
    };
    const mockHintText={
        text: vi.fn(),
        to: vi.fn(),
    };
    const mockFeedBack={
        text: vi.fn(),
        fontSize: vi.fn(),
    };
    const mockFeedBackBox={
        fill: vi.fn(),
    };
    
    beforeEach(()=>{
        vi.clearAllMocks();
        view = Object.create(GameScreenView.prototype) as GameScreenView;

        //used UIs
        (view as any).group = mockGroup;
        (view as any).questionText = mockQuestionText;
        (view as any).questionBoxText = mockQuestionBoxText;

        (view as any).progressBar = mockProgressBar;
        (view as any).progressFill = mockProgressFill;

        (view as any).hintText = mockHintText;

        (view as any).feedBack = mockFeedBack;
        (view as any).feedBackBox = mockFeedBackBox;
    });

    /*
    question type:
    export interface Question {
    id: number;
    level: number;
    question: string;
    answer: string;
    hint: string;
    isTest: boolean;
    }
    */

    /*
    -------------------------------------------------------
    check update question when it is/isn't a test question
    -------------------------------------------------------
    */

   it("update question when it is not a test question", ()=>{
        view.updateQuestion(
            {id: 1, level: 1, question: "q", answer:"a", hint:"h", isTest: false},
            0, //index
            2, //total
            3, //retry
        );
        expect(mockQuestionText.text).toHaveBeenCalledWith("q");
        expect(mockQuestionBoxText.text).toHaveBeenCalledWith("Question 1 of 2");
        expect(mockLayer.draw).toHaveBeenCalled();
   });
   
   it("update question when it is a test question", ()=>{
        view.updateQuestion(
            {id: 1, level: 1, question: "q", answer:"a", hint:"h", isTest: true},
            3, //index
            5, //total
            3, //retry
        );
        expect(mockQuestionText.text).toHaveBeenCalledWith("q");
        expect(mockQuestionBoxText.text).toHaveBeenCalledWith("Test Retries: 3");
        expect(mockLayer.draw).toHaveBeenCalled();
   });
   /*
   -------------------------------------------------------
   check update Progress
   -------------------------------------------------------
   */
   it("update progress when it is 0(just started)", () => {
        view.updateProgress(0,5);   //current 0, total 5

        expect(mockProgressBar.width).toHaveBeenCalled();
        expect(mockProgressFill.to).toHaveBeenCalledWith(
            expect.objectContaining({
                width: 0,
                duration: 0.4
            })
        );
        expect(mockLayer.batchDraw).toHaveBeenCalled();
   });
   it("update progress when it is 1/5", () => {
        view.updateProgress(1,5);

        expect(mockProgressBar.width).toHaveBeenCalled();
        expect(mockProgressFill.to).toHaveBeenCalledWith(
            expect.objectContaining({
                width: 40,
                duration: 0.4
            })
        );
        expect(mockLayer.batchDraw).toHaveBeenCalled();
   });
   /*
   -------------------------------------------------------
   check update hint
   -------------------------------------------------------
   */
  it("update hint when hint is 'h' ", () => {
        view.updateHint("h");
        expect(mockHintText.text).toHaveBeenCalledWith("h");
        expect(mockHintText.to).toHaveBeenCalledWith(
            expect.objectContaining({
                opacity: 1,
                duration: 0.4
            })
        );
        expect(mockLayer.batchDraw).toHaveBeenCalled();
  });
  /*
   -------------------------------------------------------
   check update feedback
   -------------------------------------------------------
   */
  it("update feedback with 0", () => {
        view.updateFeedBack(0);
        expect(mockFeedBack.text).toHaveBeenCalledWith("TRY AGAIN!");
        expect(mockFeedBackBox.fill).toHaveBeenCalledWith("red");
        expect(mockFeedBack.fontSize).toHaveBeenCalledWith(180);
        expect(mockLayer.draw).toHaveBeenCalled();
  });
  it("update feedback with 1", () => {
        view.updateFeedBack(1);
        expect(mockFeedBack.text).toHaveBeenCalledWith("GOOD JOB!");
        expect(mockFeedBackBox.fill).toHaveBeenCalledWith("green");
        expect(mockFeedBack.fontSize).toHaveBeenCalledWith(180);
        expect(mockLayer.draw).toHaveBeenCalled();
  });
  it("update feedback with 2", () => {
        view.updateFeedBack(2);
        expect(mockFeedBack.text).toHaveBeenCalledWith("AWESOME!");
        expect(mockFeedBackBox.fill).toHaveBeenCalledWith("green");
        expect(mockFeedBack.fontSize).toHaveBeenCalledWith(180);
        expect(mockLayer.draw).toHaveBeenCalled();
  });
  it("update feedback with 3", () => {
        view.updateFeedBack(3);
        expect(mockFeedBack.text).toHaveBeenCalledWith(
            "Uh-oh! Ran out of retries... restarting level!"
        );
        expect(mockFeedBackBox.fill).toHaveBeenCalledWith("red");
        expect(mockFeedBack.fontSize).toHaveBeenCalledWith(90);
        expect(mockLayer.draw).toHaveBeenCalled();
  });
});
