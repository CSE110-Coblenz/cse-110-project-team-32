import { describe, it, expect, vi } from "vitest";
import { signup, login } from "../../src/controllers/user";

describe("Signup Tests", () => {
    it("It should not succeed if the username or the password are incorrect", async () => {
        const username = "Amie";
        const password = "1234";
        const req = { body: { username: username, password: password } } as any;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as any;

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            error: "username and password are required",
        });
    });
});