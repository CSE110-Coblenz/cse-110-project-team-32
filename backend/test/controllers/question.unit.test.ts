import { describe, it, expect, vi, afterEach, test } from "vitest";
import express, { Request, Response } from "express";

import { getRegularQuestions, getTestQuestions } from "../../src/controllers/question";
import { getRegularQuestion, getTestQuestion } from "../../src/data/question_db";

vi.mock("../../src/data/question_db", () => ({
    getRegularQuestion: vi.fn(),
    getTestQuestion: vi.fn(),
  }));
  
describe("getRegularQuestions", () => {
it("returns questions successfully", async () => {
    (getRegularQuestion as any).mockReturnValue([{ id: 1, q: "test" }]);

    const req = {
    params: { level: "2" },
    query: { limit: "5" },
    } as any;

    const res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
    } as any;

    await getRegularQuestions(req, res);

    expect(getRegularQuestion).toHaveBeenCalledWith(2, 5);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, q: "test" }]);
});

it("returns status 500 on error", async () => {
    (getRegularQuestion as any).mockImplementation(() => {
    throw new Error("boom");
    });

    const req = {
    params: { level: "2" },
    query: {},
    } as any;

    const res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
    } as any;

    await getRegularQuestions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
    error: "Failed to fetch regular questions",
    });
});
});

describe("getTestQuestions", () => {
    it("returns test questions successfully", async () => {
        (getTestQuestion as any).mockReturnValue([{ id: 1, q: "exam" }]);

        const req = {
        params: { level: "3" },
        } as any;

        const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
        } as any;

        await getTestQuestions(req, res);

        expect(getTestQuestion).toHaveBeenCalledWith(3);
        expect(res.json).toHaveBeenCalledWith([{ id: 1, q: "exam" }]);
    });

    it("returns status 500 on error", async () => {
        (getTestQuestion as any).mockImplementation(() => {
        throw new Error("boom");
        });

        const req = {
        params: { level: "3" },
        } as any;

        const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
        } as any;

        await getTestQuestions(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch test questions",
        });
    });
});