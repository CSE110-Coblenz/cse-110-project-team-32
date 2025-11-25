import { MINI_GAME_UNLOCK_LEVELS, MINI_GAME_NAMES } from "../../constants";
import type { MiniGameInfo } from "../../types";



export class HomeScreenModel {
    private currLevel = 0; //current level of user
    private miniGames: MiniGameInfo[] = []; //minigames status
    private username: string = "";


    public async init(username: string): Promise<void> {
        if (!username) {
            console.error("No username passed to HomeScreenModel.init()");
            return;
        }

        const res = await fetch(`http://localhost:3000/api/user/username/${username}`);
        if (!res.ok) {
            console.error("Backend error:", await res.text());
            return;
        }

        const data = await res.json();
        console.log("Fetched user data:", data);

        this.currLevel = data.currLevel ?? 1;
        this.setMiniGames();
    }

    getCurrLevel(): number {
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