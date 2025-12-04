import Database from "better-sqlite3";
import { Question } from "../models/question";
import path from "path";

const questiondb = new Database(path.join(__dirname, "../../data/question.db"));

// create the questions table if it doesn’t exist
questiondb.prepare(`
  CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint TEXT NOT NULL,
  isTest INTEGER DEFAULT 0,  -- 0 = normal, 1 = test question
  isMinigame INTEGER DEFAULT 0  -- 0 = normal, 1 = minigame question
  )
`).run();

// insert data only if table is empty
const row = questiondb.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
const rowCount = row.count;

if (rowCount === 0) {
  const insert = questiondb.prepare(`
    INSERT INTO questions (level, question, answer, hint, isTest, isMinigame)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

const questions = [
  // LEVEL 1: Addition and subtraction
  [1, "What is 2 + 2?", "4", "Combine 2 and 2 to get the total.", 0, 0],
  [1, "What is 7 + 5?", "12", "Start from 7 and count 5 more.", 0, 0],
  [1, "What is 4 + 6?", "10", "Think: hold up 6 fingers, then open 4 more.", 0, 0],
  [1, "What is 3 + 3?", "6", "Double the number 3.", 0, 0],
  [1, "What is 6 + 2?", "8", "Add 2 to 6 to find the answer.", 0, 0],
  [1, "What is 5 + 9?", "14", "Add 5 and 9 together.", 0, 0],
  [1, "What is 2 + 8?", "10", "How many fingers on both hands?", 0, 0],
  [1, "What is 10 + 8?", "18", "Add 10 to 8.", 1, 0],
  [1, "What is 7 + 8?", "15", "Add 7 to 8.", 1, 0],
  [1, "What is 9 + 7?", "16", "Combine 9 and 7.", 1, 0],
  [1, "What is 9 - 3?", "6", "Subtract 3 from 9.", 0, 0],
  [1, "What is 8 - 5?", "3", "Take away 5 from 8.", 0, 0],
  [1, "What is 10 - 7?", "3", "How many left if you take 7 from 10?", 0, 0],
  [1, "What is 15 - 6?", "9", "Subtract 6 from 15.", 1, 0],
  [1, "What is 9 - 7?", "2", "Take 7 away from 9.", 0, 0],
  // LEVEL 2: Single digit multiplication
  [2, "What is 3 × 4?", "12", "Multiply 3 by 4.", 0, 0],
  [2, "What is 3 × 5?", "15", "Add 3 five times.", 0, 0],
  [2, "What is 3 × 6?", "18", "Add 3 six times.", 0, 0],
  [2, "What is 3 × 7?", "21", "Add 3 seven times.", 0, 0],
  [2, "What is 3 × 8?", "24", "Add 3 eight times.", 0, 0],
  [2, "What is 3 × 9?", "27", "Add 3 nine times.", 0, 0],
  [2, "What is 4 × 4?", "16", "Add 4 four times.", 0, 0],
  [2, "What is 4 × 5?", "20", "Add 4 five times.", 0, 0],
  [2, "What is 6 × 4?", "24", "Add 4 six times.", 0, 0],
  [2, "What is 4 × 7?", "28", "Add 4 seven times.", 0, 0],
  [2, "What is 8 × 4?", "32", "Add 8 four times.", 0, 0],
  [2, "What is 4 × 9?", "36", "Add 9 four times.", 0, 0],
  [2, "What is 5 × 5?", "25", "Add 5 five times.", 0, 0],
  [2, "What is 6 × 5?", "30", "Add 6 five times.", 0, 0],
  [2, "What is 7 × 5?", "30", "Add 5 six times.", 0, 0],
  [2, "What is 5 × 8?", "30", "Add 8 five times.", 0, 0],
  [2, "What is 5 × 9?", "45", "Add 9 five times.", 0, 0],
  [2, "What is 6 × 6?", "36", "Add 6 six times.", 0, 0],
  [2, "What is 7 × 6?", "42", "Add 7 six times.", 0, 0],
  [2, "What is 6 × 8?", "48", "Add 8 six times.", 0, 0],
  [2, "What is 7 × 2?", "14", "Double 7.", 0, 0],
  [2, "What is 7 × 7?", "49", "Add 7 seven times.", 0, 0],
  [2, "What is 7 × 8?", "56", "Add 8 seven times.", 0, 0],
  [2, "What is 7 × 9?", "63", "Add 9 seven times.", 0, 0],
  [2, "What is 9 × 6?", "54", "Add 9 six times.", 0, 0],
  [2, "What is 9 × 9?", "81", "Add 9 nine times.", 0, 0],
  [2, "What is 8 × 3?", "24", "8 threes make what?", 0, 0],
  [2, "What is 9 × 5?", "45", "No hint this time!", 1, 0],
  [2, "What is 8 × 8?", "64", "No hint this time!", 1, 0],
  // LEVEL 3: single digit times double digit multiplication
  [3, "What is 3 × 12?", "36", "what is 12 + 12 + 12?.", 0, 0],
  [3, "What is 7 × 11?", "77", "Add 7 eleven times.", 0, 0],
  [3, "What is 4 × 15?", "60", "Add four 15s.", 0, 0],
  [3, "What is 6 × 15?", "90", "Add six 15s six.", 0, 0],
  [3, "What is 5 × 14?", "70", "Add five 14s.", 0, 0],
  [3, "What is 8 × 12?", "96", "8 twelves.", 0, 0], 
  [3, "what is 15 × 3?", "45", "add 15 three times.", 0, 0],
  [3, "what is 12 × 5?", "60", "add 12 five times.", 0, 0],
  [3, "what is 11 × 4?", "44", "add 11 four times.", 0, 0],
  [3, "what is 18 × 2?", "36", "what is 18+18?", 0, 0],
  [3, "What is 9 × 20?", "180", "No hint this time!", 1, 0],
  [3, "What is 7 × 10?", "70", "No hint this time!", 1, 0],
  [3, "What is 10 × 6?", "60", "No hint this time!", 1, 0],
  // LEVEL 4: simple division
  [4, "What is 12 ÷ 3?", "4", "How many 3s in 12?", 0, 0],
  [4, "What is 20 ÷ 5?", "4", "How many 5s in 12?.", 0, 0],
  [4, "What is 18 ÷ 6?", "3", "How many 6s in 18?", 0, 0],
  [4, "What is 54 ÷ 6?", "9", "6 times what is 54?", 0, 0],
  [4, "What is 24 ÷ 8?", "3", "8 times what is 24?", 0, 0],
  [4, "What is 30 ÷ 5?", "6", "5 times what is 30?", 0, 0],
  [4, "What is 42 ÷ 7?", "6", "How many 7s in 42?", 0, 0],
  [4, "What is 56 ÷ 7?", "8", "7 times what is 56?", 0, 0],
  [4, "What is 64 ÷ 8?", "8", "8 times what is 64?", 0, 0],
  [4, "What is 36 ÷ 9?", "4", "9 times what is 36?", 0, 0],
  [4, "What is 81 ÷ 9?", "9", "No hint this time!", 1, 0],
  [4, "What is 56 ÷ 8?", "7", "No hint this time!", 1, 0],
  [4, "What is 100 ÷ 10?", "10", "No hint this time!", 1, 0],
  // LEVEL 5: simple one variable algebra (like x)
  [5, "If x + 3 = 7, what is x?", "4", "Subtract 3 from both sides.", 0, 0],
  [5, "If 2x = 10, what is x?", "5", "Divide both sides by 2.", 0, 0],
  [5, "If x - 4 = 9, what is x?", "13", "Add 4 to both sides.", 0, 0],
  [5, "If 3x = 15, what is x?", "5", "Divide both sides by 3.", 0, 0],
  [5, "If x + 7 = 12, what is x?", "5", "Subtract 7 from both sides.", 0, 0],
  [5, "If 5x = 25, what is x?", "5", "Divide both sides by 5.", 0, 0],
  [5, "If 2x + 3 = 11, what is x?", "4", "No hint this time!", 1, 0],
  [5, "If 4x - 5 = 11, what is x?", "4", "No hint this time!", 1, 0],
  /**[3, "What is 12 ÷ 4?", "3", "Division by 4.", 0],
  [3, "What is 5 * 3?", "15", "It's 5 added 3 times.", 0],
  [3, "What is the square root of 16?", "4", "A number multiplied by itself gives 16.", 1],**/

    //MINIGAME 1: Easy Questions
    [1, "What is 1 + 2?", "3", "no hint.", 0, 1],
    [1, "What is 3 + 5?", "8", "no hint.", 0, 1],
    [1, "What is 1 + 1?", "2", "no hint.", 0, 1],
    [1, "What is 11 + 2?", "13", "no hint.", 0, 1],
    [1, "What is 10 - 4?", "6", "no hint.", 0, 1],
    [1, "What number is bigger 8 or 5?", "8", "no hint.", 0, 1],
    [1, "What number is smaller 13 or 2", "2", "no hint.", 0, 1],
    [1, "Are these two numbers equal? 2 + 2 and 4? (answer yes or no)", "yes", "no hint.", 0, 1],
    [1, "Are these two numbers different? 3 + 2 and 5? (answer yes or no)", "no", "no hint.", 0, 1],
    [1, "What is 4 + 5?", "9", "no hint.", 0, 1],
    [1, "What is 2 - 1?", "1", "no hint.", 0, 1],
    [1, "What is 1 - 2?", "-1", "no hint.", 0, 1],
    [1, "What is 10 + 0?", "10", "no hint.", 0, 1],
    [1, "What is 99 + 1?", "100", "no hint.", 0, 1],
    [1, "Fill in the blank, 4, 8, ___, 16?", "12", "no hint.", 0, 1],
    [1, "Fill in the blank, 1, 2, 3, 4, ___?", "5", "no hint.", 0, 1],
    [1, "Fill in the blank, 10, 8, 6, ___, 2, 0", "4", "no hint.", 0, 1],
    [1, "Fill in the blank, 2, 5, 8, 11, ___", "14", "no hint.", 0, 1],
    [1, "What is 2 + 1?", "3", "no hint.", 0, 1],
    [1, "What is 3 + 12?", "15", "no hint.", 0, 1],

    // MINIGAME 2: Medium Questions
    [2, "Which kind of triangles has all equal sides, equilateral, isosceles, or scalene (put answer all in lowercase)?","equilateral", "no hint.", 0, 1],
    [2, "How many faces does a cube have?", "6", "No hint.", 0, 1],
    [2, "How many faces does a tetrahedron have?", "4", "No hint.", 0, 1],
    [2, "How many faces does a sphere have?", "1", "No hint.", 0, 1],
    [2, "How many sides does a rectangle have?", "4", "No hint.", 0, 1],
    [2, "How many degrees does a right angle have?", "90", "No hint.", 0, 1],
    [2, "How many sides does a circle have?", "1", "No hint.", 0, 1],
    [2, "An angle that is between 90 and 180 degrees is ______? (write all letters in lowercase)", "obtuse", "No hint.", 0, 1],
    [2, "An angle that is between 0 and 90 degrees is ________? (write all letters in lowercase)", "acute", "No hint.", 0, 1],
    [2, "What is the area of a square whose sides are 3 units long?", "9", "No hint.", 0, 1],
    [2, "How many sides does a pentagon have?", "5", "No hint.", 0, 1],
    [2, "What is 1/2 + 1/2 (enter your answer as a whole number)?", "1", "No hint.", 0, 1],
    [2, "What is smaller 2/3 or 1/3?", "1/3", "No hint.", 0, 1],
    [2, "What is smaller 2/4 or 1/7?", "1/7", "No hint.", 0, 1],
    [2, "What is 14/2 + 4/2 (enter your answer as a whole number)?", "9", "No hint.", 0, 1],
    [2, "What is 2.3 + 1.1?", "3.4", "No hint.", 0, 1],
    [2, "What is 1.01 + 0.01?", "1.02", "No hint.", 0, 1],
    [2, "What is bigger 0.1 or 0.0100?", "0.1", "No hint.", 0, 1],
    [2, "Which of the following is the prime number: 1, 2, 4, or 9?", "2", "No hint.", 0, 1],
    [2, "Which of the following is the prime number: 13, 12, 21, 33?", "13", "No hint.", 0, 1],



    // MINIGAME 2: Hard Questions
    [3, "What is (4 + 5) * 3?", "27", "No hint", 0, 1],
    [3, "What is (2 + 3) * 4?", "20", "No hint", 0, 1],
    [3, "What is (10 / 2) * 4?", "20", "No hint", 0, 1],
    [3, "What is (15 + 3) * 2?", "36", "No hint", 0, 1],
    [3, "What is (2 + 3) + (5 * 7)?", "40", "No hint", 0, 1],
    [3, "What is (2 + 3) + (4 * 11)?", "49", "No hint", 0, 1],
    [3, "What is 4 * (6 + 7)?", "52", "No hint", 0, 1],
    [3, "What is 3 * (7 + 2)?", "27", "No hint", 0, 1],
    [3, "What is 8 * (1 + 1)?", "16", "No hint", 0, 1],
    [3, "What is (22 - 10) * 4?", "48", "No hint", 0, 1],
    [3, "What is 1 * 4?", "4", "No hint", 0, 1],
    [3, "What is [(10 + 4) / (14 * 2 - 26)] * 4?", "28", "No hint", 0, 1],
    [3, "What is 10² + 3²?", "109", "No hint", 0, 1],
    [3, "What is 2² * 2²?", "16", "No hint", 0, 1],
    [3, "What is 2 + 3²?", "11", "No hint", 0, 1],
    [3, "What is 2 * 2 * 2 * 2?", "16", "No hint", 0, 1],
    [3, "What is 3 * 3 * 3?", "27", "No hint", 0, 1],
    [3, "What is [15]⁽³⁻³⁾ ?", "1", "No hint", 0, 1],
    [3, "What is (5 * 2) + 4?", "14", "No hint", 0, 1],
    [3, "What is (7 * 9) + 3?", "66", "No hint", 0, 1],

  ];
  
const insertMany = questiondb.transaction((questions: any[]) => {
  for (const q of questions) insert.run(...q);
});

insertMany(questions);
}


export function getRegularQuestion(level: number, limit: number = 5): Question[] {
  return questiondb
    .prepare(`
      SELECT * FROM questions
      WHERE level = ? AND isTest = 0 AND isMinigame = 0
      ORDER BY RANDOM()
      LIMIT ?
    `)
    .all(level, limit) as Question[];
}

export function getTestQuestion(level: number): Question | null {
  return questiondb
    .prepare(`
      SELECT * FROM questions
      WHERE level = ? AND isTest = 1 AND isMinigame = 0
      ORDER BY RANDOM()
      LIMIT 1
    `)
    .get(level) as Question | null;
}

export function getMiniGameTwoQuestion(level: number, limit: number): Question[] {
  return questiondb
    .prepare(`
      SELECT * FROM questions
      WHERE level = ? AND isMinigame = 1
      ORDER BY RANDOM()
      LIMIT ?
    `)
    .all(level, limit) as Question[];
}
