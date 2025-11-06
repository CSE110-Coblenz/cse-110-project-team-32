// This script defines a User Class which the game can use 

export interface UserData {
  id: string;
  name: string;
  currentLevel: number;
  lockedLevels: Array<number>;
}

export class User {
    id: string;
    name: string;
    currentLevel: number;
    lockedLevels: Array<number>;

    private static readonly MAX_LEVEL = 10;

    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
        this.currentLevel = data.currentLevel;
        this.lockedLevels = this.computeLockedLevels();
    }

    levelUp() {
        if (this.currentLevel < User.MAX_LEVEL){
            this.currentLevel++;
            this.lockedLevels = this.computeLockedLevels();
        } else {
            console.log("Game Over, all levels complete");
        }
        // TODO : do we want to store this back into database everytime it levelUp or only just before the game logsout ?
    }

    private computeLockedLevels(): number[]{
        const locked: number[] = [];
        for (let i: number = 0; i < 10; i++) {
            if (i > this.currentLevel) {
                locked.push(i);
            }
        }
        return locked;
    }


}