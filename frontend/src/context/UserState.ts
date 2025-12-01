// UserState.ts

export interface UserState {
  username: string; // always required
  currLevel: number;
}

class UserStore {
  private state: UserState | null = null; // initially null

  getState(): UserState {
    if (!this.state) throw new Error("UserState not initialized. Username is required.");
    return this.state;
  }

  setUsername(username: string) {
    if (!username) throw new Error("Username cannot be empty");
    if (!this.state) {
      this.state = { username, currLevel: 1 };
    } else {
      this.state.username = username;
    }
  }

  setCurrLevel(level: number) {
    if (!this.state) throw new Error("UserState not initialized");
    this.state.currLevel = level;
  }

  getCurrLevel(): number {
    if (!this.state) throw new Error("UserState not initialized");
      return this.state.currLevel;
  }


  incrementLevel() {
    if (!this.state) throw new Error("UserState not initialized");
    this.state.currLevel += 1;
  }
}

export const userStore = new UserStore();
