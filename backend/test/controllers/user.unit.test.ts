import { describe, it, expect, vi } from "vitest";
import { signup, login } from "../../src/controllers/user";
import { getUserByUsername } from "../../src/data/user_db"

vi.mock("../../src/data/user_db", () => ({
  getUserByUsername: vi.fn(),
}));

describe("Signup Tests", () => {
    it("It should not succeed if the username or the password are null", async () => {
        const req = { body: {} } as any;
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as any;

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "username and password are required",
        });
    });
      it("returns 409 if username already exists", async () => {
        (getUserByUsername as any).mockResolvedValueOnce({
        id: 1,
        username: "FirstUser"
        });

        const req = {
            body: { username: "FirstUser", password: "12345" }
        } as any;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any;

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
        error: "Username already exists"
        });
    });
});