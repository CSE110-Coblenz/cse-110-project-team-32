import { describe, it, beforeEach, expect } from "vitest";
import { addUser, getUserByUsername, getAllUsers, getUserById, deleteUser } from "../../src/data/user_db";
import userdb from "../../src/data/user_db";

describe("addUser test", () => {
  // Clean the users table before each test so tests don't interfere
  beforeEach(() => {
    userdb.prepare("DELETE FROM users").run();
  });

  it("Test 1: inserts a user and returns its id", () => {
    // Act
    const id = addUser("alice", "supersecret");

    // Assert: id should be a positive integer
    expect(id).toBeGreaterThan(0);

    // And the row should exist in the DB
    const row = userdb
      .prepare("SELECT id, username, password, currLevel FROM users WHERE id = ?")
      .get(id);

    expect(row).toBeDefined();
    expect(row.username).toBe("alice");
    expect(row.password).toBe("supersecret");
  });

    it("Test 2: inserts several users and check their ids", () => {
    // Act
    const id = addUser("alice", "supersecret");
    const id2 = addUser("bob", "top secret");
    const id3 = addUser("eve", "ultra secret");
    const id4 = addUser("dave", "mega secret");

    // Assert: id should be a positive integer
    expect(id2).toBe(id + 1);
    expect(id3).toBe(id + 2);
    expect(id4).toBe(id + 3);

    // And the row should exist in the DB
    const row = userdb
      .prepare("SELECT id, username, password FROM users WHERE id = ?")
      .get(id);
    const row2 = userdb
      .prepare("SELECT id, username, password FROM users WHERE id = ?")
      .get(id2); 
    const row3 = userdb
      .prepare("SELECT id, username, password FROM users WHERE id = ?")
      .get(id3);
    const row4 = userdb
      .prepare("SELECT id, username, password FROM users WHERE id = ?")
      .get(id4); 

    expect(row).toBeDefined();
    expect(row.username).toBe("alice");
    expect(row.password).toBe("supersecret");

    expect(row2).toBeDefined();
    expect(row2.username).toBe("bob");
    expect(row2.password).toBe("top secret");

    expect(row3).toBeDefined();
    expect(row3.username).toBe("eve");
    expect(row3.password).toBe("ultra secret");

    expect(row4).toBeDefined();
    expect(row4.username).toBe("dave");
    expect(row4.password).toBe("mega secret");
  });
});

describe("getUserByUsername test", () => {
    // Clean the database before going to the next test
    beforeEach(() => {
        userdb.prepare("DELETE from users").run();
    });
    
    it("Test 1: Add a user to the database and ensure that getUserByUsername gets the requested user", () => {
        const id = addUser("Alice", "password");

        let user = getUserByUsername("Alice");
        let user2 = getUserByUsername("Bob");

        expect(user!.username).toBe("Alice");
        expect(user!.password).toBe("password");
        expect(user2).toBe(undefined);
    });
});

describe("getAllUsers", () => {
    //Delete all the users in the database before running each test
    beforeEach(() => {
        userdb.prepare("DELETE FROM users").run();
    });

    it("Test 1: Add 3 users to the database and ensure that getAllUsers returns all three users", () => {
        const id1 = addUser("FirstUser", "Hello World");
        const id2 = addUser("SecondUser", "Password");
        const id3 = addUser("ThirdUser", "ComputerPassword");

        const users = getAllUsers();
        expect(users.length).toBe(3);
        expect((users as any)[0].username).toBe("FirstUser");
        expect((users as any)[1].username).toBe("SecondUser");
        expect((users as any)[2].username).toBe("ThirdUser");
    });
});


describe("getUserById test", () => {
    //Delete any users in the database before running each test
    beforeEach(() => {
        userdb.prepare("DELETE FROM users").run();
    });

    it("Test 1: Add 3 users, then user getUserById function, and expect all the calls to this function to return the expected user", () => {
        const id1 = addUser("FirstUser", "Hello World");
        const id2 = addUser("SecondUser", "Password");
        const id3 = addUser("ThirdUser", "ComputerPassword");

        const user1 = getUserById(id1);
        const user2 = getUserById(id2);
        const user3 = getUserById(id3);

        expect(user1!.username).toBe("FirstUser");
        expect(user2!.username).toBe("SecondUser");
        expect(user3!.username).toBe("ThirdUser");
    });
});

describe("deleteUser", () => {
    it("Test 1: Add 3 users, delete one, and only two users remain", () => {
        const id1 = addUser("FirstUser", "Hello World");
        const id2 = addUser("SecondUser", "Password");
        const id3 = addUser("ThirdUser", "ComputerPassword");

        deleteUser(id3);
        const user1 = getUserById(id1);
        const user2 = getUserById(id2);
        const user3 = getUserById(id3);

        expect(user1!.username).toBe("FirstUser");
        expect(user2!.username).toBe("SecondUser");
        expect(user3).toBe(undefined);
    });
});