import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import developerRoutes from "./routes/developers";
import skillRoutes from "./routes/skills";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/developers", developerRoutes);
app.use("/skills", skillRoutes);

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
