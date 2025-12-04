import { describe, it, expect, vi, beforeAll } from "vitest";
import { signup, login } from "../../src/controllers/user";
import { getUserByUsername, addUser } from "../../src/data/user_db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//----------------------------------------- Helper functions -----------------------------------------------------------
beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
})

vi.mock("../../src/data/user_db", () => ({
  getUserByUsername: vi.fn(),
  addUser: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed"),
    compare: vi.fn().mockResolvedValue(true)
  }
}));

vi.mock("jsonwebtoken", () => ({
    default: {
        sign: vi.fn().mockReturnValue("fake.jwt.token"),
        verify: vi.fn(),
    }
}));

export function createMockRes() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as any;
}

export async function expectHandleError(
    handler: (req: any, res: any) => any,
    body: any,
    statusCode: number,
    errorMessage: string,
) {
    const req = { body } as any;
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
}

export async function expectCorrectResult(
    handler: (req: any, res: any) => any,
    body: any,
    statusCode: number,
    id: number,
    username: string,
) {
    const req = { body } as any;
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({ id, username });

}

export async function expectCorrectResultLogin(
    id: number,
    usernameInDatabase: string,
    passwordInDatabase: string,
    username: string,
    password: string
) {
        (getUserByUsername as any).mockResolvedValueOnce({
            id: id,
            username: usernameInDatabase,
            password: passwordInDatabase,
        });
        (bcrypt.compare as any).mockResolvedValueOnce(true);
        (jwt.sign as any).mockReturnValueOnce("fake.jwt.token");
        const req = { body: { username: username, password: password } } as any;
        const res = createMockRes();

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            token: "fake.jwt.token",
            user: { id: id, username: usernameInDatabase } 
            });
}

//----------------------------------------------- Signup tests -------------------------------------------------------------

describe("Signup Tests", () => {
    it("Test 1: The user entered a password but not a username", async () => {
        await expectHandleError(
            signup,
            { password: "123" } as any,
            400,
            "Username and password are required"
        )
    });

    it("Test 2: The user entered a username but not a password", async() => {
        await expectHandleError(
            signup,
            { username: "new user" } as any,
            400,
            "Username and password are required"
        )
    });

    it("Test 3: The user didn't enter a username nor a password", async() => {
        await expectHandleError(
            signup,
            {},
            400,
            "Username and password are required"
        )
    });

    it("Test 4: The user entered an existing username", async() => {
        (getUserByUsername as any).mockResolvedValueOnce({
        id: 1,
        username: "FirstUser",
        });
        await expectHandleError(
            signup,
            { username: "FirstUser", password: "12345" },
            409,
            "Username already exists"
        )
    });

    it("Test 5: The user entered a password that was no longer than 12 characters without counting trailing spaces", async() => {
        await expectHandleError(
            signup,
            { username: "Brian", password: "helloworld" },
            400,
            "Make sure the password is more than 12 characters long",
        )
    });

    it("Test 6: The user entered a password that was longer than 12 characters but counting trailing spaces (without them" +
        "it was no longer than 12 characters", async() => {
        await expectHandleError(
            signup,
            { username: "Brian", password: "helloworld   "} as any,
            400,
            "Make sure the password is more than 12 characters long"
        )

    });

    it("Test 7: The user entered a non-existent username and a password that is longer than" +
        " 12 characters, not counting trailing spaces", async() => {
        (getUserByUsername as any).mockResolvedValueOnce(null);
        (bcrypt.hash as any).mockResolvedValueOnce();
        (addUser as any).mockReturnValueOnce(1);
        await expectCorrectResult(
            signup,
            { username: "Brian", password: "thePasswordHasMoreThan12Characters" } as any,
            201,
            1,
            "Brian",
        )
    });

    it("Test 8: The user entered a non-existent username and a password that is longer than" +
        " 12 characters without trailing spaces and has trailing spaces", async() => {
            (getUserByUsername as any).mockResolvedValueOnce(null);
            (bcrypt.hash as any).mockResolvedValueOnce();
            (addUser as any).mockReturnValueOnce(1);
            await expectCorrectResult(
              signup,
              { username: "Brian", password: "thePassworldHasMoreThan12Characters   " } as any,
              201,
              1,
              "Brian",  
            )
        })
});

//----------------------------------------------- Login tests -----------------------------------------------------------


describe("Login Tests", () => {
    it("Test 1: The user entered a username but not a password", async() => {
        await expectHandleError(
            login,
            { username: "Brian" },
            400,
            "Username and password are required"
        )
    });

    it("Test 2: The user entered a password but not a username", async() => {
        await expectHandleError(
            login,
            { password: "one password" } as any,
            400,
            "Username and password are required"
        )
    });

    it("Test 3: The user didn't enter a username nor a password", async() => {
        await expectHandleError(
            login,
            {} as any,
            400,
            "Username and password are required"
        )
    });

    it("Test 4: The user entered a non-existent username", async() => {
        (getUserByUsername as any).mockResolvedValueOnce(null);
        await expectHandleError(
            login,
            { username: "non-existent", password: "helloWorld123" } as any,
            401,
            "Invalid credentials"
        )
    });

    it("Test 5: The user entered an existent username but the password was incorrect", async() => {
        (getUserByUsername as any).mockResolvedValueOnce({
            id: 1,
            username: "exists",
            password: "helloIncorrectPassword"
        });
        (bcrypt.compare as any).mockResolvedValueOnce(false);
        await expectHandleError(
            login,
            { username: "exists", password: "helloWorld123" } as any,
            401,
            "Invalid credentials"
        )
    });

    it("Test 6: The user entered their username and password correctly but the username had trailing spaces", async() => {
        expectCorrectResultLogin(
            1,
            "Monica",
            "ALongEnoughPassword",
            "Monica    ",
            "ALongEnoughPassword"
        )
        
    });

    it("Test 7: The user entered their username and pasword but the password had trailing spaces", async() => {
        expectCorrectResultLogin(
            1,
            "Monica",
            "ALongEnoughPassword",
            "Monica",
            "ALongEnoughPassword   "
        );
    });

    it("Test 8: The user entered their username and password correctly and none had trailing spaces", async() => {
        expectCorrectResultLogin(
            1,
            "Monica",
            "ALongEnoughPassword",
            "Monica",
            "ALongEnoughPassword"
        )
    });
});