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
    // LEVEL 1: Addition
    [1, "What is 2 + 2?", "4", "Think of pairs.", 0, 0],
    [1, "What is 7 + 5?", "12", "Add 7 and 5 together.", 0, 0],
    [1, "What is 4 + 6?", "10", "Think of adding two even numbers.", 0, 0],
    [1, "What is 3 + 3?", "6", "It's double 3.", 0, 0],
    [1, "What is 6 + 2?", "8", "Add 2 more than 6.", 0, 0],
    [1, "What is 5 + 9?", "14", "Add 10 then subtract 1.", 0, 0],
    [1, "What is 2 + 8?", "10", "Ten fingers on two hands!", 0, 0],
    [1, "What is 10 + 8?", "18", "No hint this time!", 1, 0],
    [1, "What is 7 + 8?", "15", "No hint this time!", 1, 0],
    [1, "What is 9 + 7?", "16", "No hint this time!", 1, 0],
  
    // LEVEL 2: Subtraction
    [2, "What is 9 - 3?", "6", "Take 3 away from 9.", 0, 0],
    [2, "What is 8 - 5?", "3", "Subtract 5 from 8.", 0, 0],
    [2, "What is 10 - 7?", "3", "How far is 7 from 10?", 0, 0],
    [2, "What is 15 - 6?", "9", "Think of how much 6 less than 15 is.", 1, 0],
    [2, "What is 9 - 7?", "2", "Simple subtraction.", 0, 0],
  
    // LEVEL 3: Mixed Operations
    [3, "What is 12 ÷ 4?", "3", "Division by 4.", 0, 0],
    [3, "What is 5 * 3?", "15", "It's 5 added 3 times.", 0, 0],
    [3, "What is the square root of 16?", "4", "A number multiplied by itself gives 16.", 1, 0],


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
    [3, "What is (2 + 3²) * 1²²⁴?", "11", "No hint", 0, 1],
    [3, "What is 2⁸?", "256", "No hint", 0, 1],
    [3, "What is 3 * 3 * 3?", "27", "No hint", 0, 1],
    [3, "What is [6² + √(13) + ²10 + 3π]⁽³⁻³⁾ ?", "1", "No hint", 0, 1],
    [3, "What is {5 * 2[6 + (2 * 2)] + [3² + (5 + 2)]}?", "116", "No hint", 0, 1],
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
