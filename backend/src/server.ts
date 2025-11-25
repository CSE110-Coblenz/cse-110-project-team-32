import app from "./app";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Use the PORT from .env if available, otherwise default to 3000
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});