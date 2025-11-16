export class Minigame1ScreenModel {
  private score: number = 0;

  reset(): void {
    this.score = 0;
  }

  increaseScore(): void {
    this.score++;
  }

  getScore(): number {
    return this.score;
  }
}