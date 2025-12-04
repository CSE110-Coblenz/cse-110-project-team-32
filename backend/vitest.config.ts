import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config(); // loads backend/.env

export default defineConfig({
  test: {
    setupFiles: ["test/controllers/env.ts"],
  },
});