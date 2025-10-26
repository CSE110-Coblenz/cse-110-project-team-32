// This script defines a User Class which the game can use 

export interface UserData {
  id: string;
  name: string;
  currentLevel: number;
}

export class User {
    id: string;
    name: string;
    currentLevel: number;

    constructor(data: UserData) {
        this.id = data.id;
        this.name = data.name;
        this.currentLevel = data.currentLevel;
    }

    levelUp() {
        this.currentLevel++;
        // TODO : do we want to store this back into database everytime it levelUp or only just before the game logsout ?
    }


}

