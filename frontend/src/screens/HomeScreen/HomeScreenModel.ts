import { MINI_GAME_UNLOCK_LEVELS, MINI_GAME_NAMES } from "../../constants";
import type { MiniGameInfo } from "../../types";



export class HomeScreenModel {
    private currLevel = 0; //current level of user
    private miniGames: MiniGameInfo[] = []; //minigames status


    setCurrentLevel(): void {
        // get the latest level the user stopped at
        // set currLevel to it
        // also update when level changes
        this.currLevel = 3;
    }

    getCurrLevel(): number {
        return this.currLevel;
    }


   public setMiniGames(): void {
        this.miniGames = MINI_GAME_NAMES.map((name, i) => ({
        name,
        unlockLevel: MINI_GAME_UNLOCK_LEVELS[i],
        unlocked: this.currLevel >= MINI_GAME_UNLOCK_LEVELS[i],
        }));
    }

    public getMiniGames(): MiniGameInfo[] {
        return this.miniGames;
    }

}