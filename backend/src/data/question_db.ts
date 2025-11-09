import Database from "better-sqlite3";
import { Question } from "../models/question";
import path from "path";

const questiondb = new Database(path.join(__dirname, "question.db"));

// create the questions table if it doesn’t exist
questiondb.prepare(`
  CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  hint TEXT NOT NULL
  )
`).run();

// insert data only if table is empty
const row = questiondb.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
const rowCount = row.count;

if (rowCount === 0) {
  const insert = questiondb.prepare(`
    INSERT INTO questions (level, question, answer, hint)
    VALUES (?, ?, ?, ?)
  `);

const questions = [
  [1, "What is 2 + 2?", "4", "Think of pairs."],
  [1, "What is 5 * 3?", "15", "It's 5 added 3 times."],
  [2, "What is 12 ÷ 4?", "3", "Division by 4."],
  [2, "What is 9 - 7?", "2", "Simple subtraction."],
  [3, "What is the square root of 16?", "4", "A number multiplied by itself gives 16."],
];
  

const insertMany = questiondb.transaction((questions: any[]) => {
  for (const q of questions) insert.run(...q);
});

insertMany(questions);
}


export function getQuestionsByLevel(level: number, limit: number): Question[] {
  return questiondb.prepare(`
      SELECT * FROM questions
      WHERE level = ?
      ORDER BY RANDOM()
      LIMIT ?
  `).all(level, limit) as Question[];
}