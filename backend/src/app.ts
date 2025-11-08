import express from "express";
import cors from "cors";
import userRoutes from "./routes/user";
import questionRoutes from "./routes/question";

const app = express();

//Allow the app router to get http requests from any path
app.use(cors());
//Convert any objects that come in string form into a .json form so that
//they can be better handled by the backend
app.use(express.json());

//Routes that we are mounting to the main router app
// app.use("/api/user", userRoutes);
app.use("/api/questions", questionRoutes);

export default app;