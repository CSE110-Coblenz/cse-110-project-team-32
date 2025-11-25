export class Minigame1ScreenModel {
  private totalCorrect: number;
  private timeLeft: number;
  private fireSize: number;
  private isGameOver: boolean;
  private isWin: boolean;
 

  private sequence: number[] = [];  // 5 numbers to show
  private expectedAnswer: number = 0; // correct 6th number

  private readonly INITIAL_TIME = 60;
  private readonly FIRE_GROWTH = 0.3;
  private readonly REQUIRED_CORRECT = 5;

//   private questions = [{ text: "1 + 1 = ?", answer: "2" }];
//   private index = 0;


/***
 * Logic:
 * rondom generate 2 numbers to form a question
 * check answer
 * if correct: totalCorrect ++
 * if totalCorrect >= REQUIRED_CORRECT -> win
 * else if timeLeft == 0 -> lose
 * else continue
 * 
 * example : 2 number： 2 and 3, 
 * question: "2, (2+3), 8, 14, 19, ?"
 * answer: 24
 * 
 */

// TODO: reset use twice
  constructor() {


    this.totalCorrect = 0;
    this.timeLeft = this.INITIAL_TIME;
    this.fireSize = 1;
    this.isGameOver = false;
    this.isWin = false;

    // reset question index
    //this.index = 0;
  }

  reset(): void {
    this.totalCorrect = 0;
    this.timeLeft = this.INITIAL_TIME;
    this.fireSize = 1;
    this.isGameOver = false;
    this.isWin = false;

    // reset question index
    //this.index = 0;

    this.generateNewQuestion();
  }

  /**
   * 
   * Logic
   */
  generateNewQuestion() {
        const start = Math.floor(Math.random() * 9) + 1;
        const step = Math.floor(Math.random() * 10) + 1;

        this.sequence = [];

        for (let i = 0; i < 5; i++) {
            this.sequence.push(start + i * step);
        }

        this.expectedAnswer = start + 5 * step;
    }

  getSequence(): number[] {
        return this.sequence;
    }

    checkAnswer(userAnswer: number): boolean {
        const correct = userAnswer === this.expectedAnswer;

        if (correct) {
            this.generateNewQuestion(); // generate next question
        }

        return correct;
    }

  getTotalCorrect() { return this.totalCorrect; }
  getTimeLeft() { return this.timeLeft; }
  getFireSize() { return this.fireSize; }
  getIsGameOver() { return this.isGameOver; }
  setGameOver(){ this.isGameOver = true;}
  getIsWin() { return this.isWin; }

  incrementCorrect(): void {
    // console.log("incremented!");
    this.totalCorrect++;
    if (this.totalCorrect >= this.REQUIRED_CORRECT) {
      this.isGameOver = true;
      this.isWin = true;
    }
  }

  reduceTime(): void {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    }

    if (this.timeLeft === 0) {
      this.isGameOver = true;
      this.isWin = false;
    }
  }

//   getCurrentQuestion() {
//     return this.questions[this.index];
//   }

//   nextQuestion() {
//     // Only 1 question for now
//   }
}
