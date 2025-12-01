import { MINI_GAME_UNLOCK_LEVELS, MINI_GAME_NAMES } from "../../constants";
import type { MiniGameInfo } from "../../types";
import { userStore } from "../../context/UserState.ts";



export class HomeScreenModel {
    private currLevel = 1; //current level of user
    private miniGames: MiniGameInfo[] = []; //minigames status
    private username!: string;


    public init(): void {
        const state = userStore.getState();
        console.log("context username:", state.username, state.currLevel);

        this.currLevel = state.currLevel ?? 1;
        this.setMiniGames();
    }

    getCurrLevel(): number {
        const state = userStore.getState();
        this.currLevel = state.currLevel ?? 1;
        console.log(this.currLevel);
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

    public setUsername(username: string): void {
        this.username = username;
    }

    public getUsername(): string {
        return this.username;
    }

}