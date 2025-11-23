import Database from "better-sqlite3";
import { Question } from "../models/question";
import path from "path";

const questiondb = new Database(path.join(__dirname, "/question.db"));

// create the questions table if it doesn’t exist
questiondb.prepare(`
  CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint TEXT NOT NULL,
  isTest INTEGER DEFAULT 0  -- 0 = normal, 1 = test question
  )
`).run();

// insert data only if table is empty
const row = questiondb.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
const rowCount = row.count;

if (rowCount === 0) {
  const insert = questiondb.prepare(`
    INSERT INTO questions (level, question, answer, hint, isTest)
    VALUES (?, ?, ?, ?, ?)
  `);

const questions = [
  // LEVEL 1: Addition and subtraction
  [1, "What is 2 + 2?", "4", "Combine 2 and 2 to get the total.", 0],
  [1, "What is 7 + 5?", "12", "Start from 7 and count 5 more.", 0],
  [1, "What is 4 + 6?", "10", "Think: hold up 6 fingers, then open 4 more.", 0],
  [1, "What is 3 + 3?", "6", "Double the number 3.", 0],
  [1, "What is 6 + 2?", "8", "Add 2 to 6 to find the answer.", 0],
  [1, "What is 5 + 9?", "14", "Add 5 and 9 together.", 0],
  [1, "What is 2 + 8?", "10", "How many fingers on both hands?", 0],
  [1, "What is 10 + 8?", "18", "Add 10 to 8.", 1],
  [1, "What is 7 + 8?", "15", "Add 7 to 8.", 1],
  [1, "What is 9 + 7?", "16", "Combine 9 and 7.", 1],
  [1, "What is 9 - 3?", "6", "Subtract 3 from 9.", 0],
  [1, "What is 8 - 5?", "3", "Take away 5 from 8.", 0],
  [1, "What is 10 - 7?", "3", "How many left if you take 7 from 10?", 0],
  [1, "What is 15 - 6?", "9", "Subtract 6 from 15.", 1],
  [1, "What is 9 - 7?", "2", "Take 7 away from 9.", 0],
  // LEVEL 2: Single digit multiplication
  [2, "What is 3 × 4?", "12", "Multiply 3 by 4.", 0],
  [2, "What is 7 × 2?", "14", "Double 7.", 0],
  [2, "What is 5 × 6?", "30", "5 times 6 is 30.", 0],
  [2, "What is 8 × 3?", "24", "8 threes make 24.", 0],
  [2, "What is 4 × 9?", "36", "Think of 4 nines.", 0],
  [2, "What is 6 × 7?", "42", "Multiply 6 by 7.", 0],
  [2, "What is 9 × 5?", "45", "No hint this time!", 1],
  [2, "What is 8 × 8?", "64", "No hint this time!", 1],
  // LEVEL 3: single digit times double digit multiplication
  [3, "What is 3 × 12?", "36", "Multiply 3 by 12.", 0],
  [3, "What is 7 × 11?", "77", "Multiply 7 by 11.", 0],
  [3, "What is 4 × 15?", "60", "Multiply 4 by 15.", 0],
  [3, "What is 6 × 13?", "78", "6 times 13.", 0],
  [3, "What is 5 × 14?", "70", "Multiply 5 by 14.", 0],
  [3, "What is 8 × 12?", "96", "8 twelves.", 0],
  [3, "What is 9 × 17?", "153", "No hint this time!", 1],
  [3, "What is 7 × 19?", "133", "No hint this time!", 1],
  // LEVEL 4: simple division
  [4, "What is 12 ÷ 3?", "4", "How many 3s in 12?", 0],
  [4, "What is 20 ÷ 5?", "4", "Divide 20 by 5.", 0],
  [4, "What is 18 ÷ 6?", "3", "Divide 18 by 6.", 0],
  [4, "What is 24 ÷ 8?", "3", "Divide 24 by 8.", 0],
  [4, "What is 30 ÷ 5?", "6", "Divide 30 by 5.", 0],
  [4, "What is 42 ÷ 7?", "6", "Divide 42 by 7.", 0],
  [4, "What is 81 ÷ 9?", "9", "No hint this time!", 1],
  [4, "What is 56 ÷ 8?", "7", "No hint this time!", 1],
  // LEVEL 5: simple one variable algebra (like x)
  [5, "If x + 3 = 7, what is x?", "4", "Subtract 3 from both sides.", 0],
  [5, "If 2x = 10, what is x?", "5", "Divide both sides by 2.", 0],
  [5, "If x - 4 = 9, what is x?", "13", "Add 4 to both sides.", 0],
  [5, "If 3x = 15, what is x?", "5", "Divide both sides by 3.", 0],
  [5, "If x + 7 = 12, what is x?", "5", "Subtract 7 from both sides.", 0],
  [5, "If 5x = 25, what is x?", "5", "Divide both sides by 5.", 0],
  [5, "If 2x + 3 = 11, what is x?", "4", "No hint this time!", 1],
  [5, "If 4x - 5 = 11, what is x?", "4", "No hint this time!", 1],
  /**[3, "What is 12 ÷ 4?", "3", "Division by 4.", 0],
  [3, "What is 5 * 3?", "15", "It's 5 added 3 times.", 0],
  [3, "What is the square root of 16?", "4", "A number multiplied by itself gives 16.", 1],**/
];
  

const insertMany = questiondb.transaction((questions: any[]) => {
  for (const q of questions) insert.run(...q);
});

insertMany(questions);
}

/*
export function getQuestionsByLevel(level: number, limit: number): Question[] {
  return questiondb.prepare(`
      SELECT * FROM questions
      WHERE level = ?
      ORDER BY RANDOM()
      LIMIT ?
  `).all(level, limit) as Question[];
}
*/

export function getRegularQuestion(level: number, limit: number = 5): Question[] {
  return questiondb
    .prepare(`
      SELECT * FROM questions
      WHERE level = ? AND isTest = 0
      ORDER BY RANDOM()
      LIMIT ?
    `)
    .all(level, limit) as Question[];
}

export function getTestQuestion(level: number): Question | null {
  return questiondb
    .prepare(`
      SELECT * FROM questions
      WHERE level = ? AND isTest = 1
      ORDER BY RANDOM()
      LIMIT 1
    `)
    .get(level) as Question | null;
}
