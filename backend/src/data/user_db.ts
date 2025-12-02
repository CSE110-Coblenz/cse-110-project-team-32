import Database from "better-sqlite3";
import { User } from "../models/user";
import path from "path";

// Create or open the SQLite database file
const userdb = new Database(path.join(__dirname, "../../data/user.db"));

// Create the "users" table if it doesn’t already exist
userdb.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// Optional: insert sample data if the table is empty
const { count } = userdb
  .prepare("SELECT COUNT(*) as count FROM users")
  .get() as { count: number };

if (count === 0) {
  const insert = userdb.prepare(`
    INSERT INTO users (username, password)
    VALUES (?, ?)
  `);
}

// Example functions for CRUD operations
export function addUser(username: string, password: string): number {
  const info = userdb
    .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .run(username, password);
  return Number(info.lastInsertRowid);
}

export function getUserByUsername(username: string): User | undefined {
  return userdb
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as User | undefined;
}

export function getAllUsers() {
  return userdb.prepare("SELECT * FROM users").all();
}

export function getUserById(id: number): User | undefined {
  return userdb
  .prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export function deleteUser(id: number) {
  userdb.prepare("DELETE FROM users WHERE id = ?").run(id);
}

// Export the database (optional if you need raw access)
export default userdb;