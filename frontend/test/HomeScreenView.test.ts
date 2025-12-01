import {describe, it, expect, vi, beforeEach } from "vitest";
// import {GameScreenController} from "../src/screens/GameScreen/GameScreenController"
// import {GameScreenModel} from "../src/screens/GameScreen/GameScreenModel"
import {HomeScreenView} from "../src/screens/HomeScreen/HomeScreenView"

describe("HomeScreenViewTest", ()=>{
    let view: HomeScreenView;
    const mockLayer = {
        draw: vi.fn(),
    };
    const mockUserText = {
        text: vi.fn(),
        getLayer: vi.fn().mockReturnValue(mockLayer),
    };
    beforeEach(()=>{
        vi.clearAllMocks();
        view = Object.create(HomeScreenView.prototype) as HomeScreenView;

        //UIs
        (view as any).userText = mockUserText;
    });
    /*
    -------------------------------------------------------
    check update username
    -------------------------------------------------------
    */
    it("update username with 'userA'", () => {
        view.updateUserName("userA");
        expect(mockUserText.text).toHaveBeenCalledWith("Hello, userA");
        expect(mockUserText.getLayer).toHaveBeenCalled();
        expect(mockLayer.draw).toHaveBeenCalled();
    });

    
});