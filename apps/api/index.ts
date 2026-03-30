import express from "express";
import { taskQueue } from "./queue/queue.js";
import { v4 as uuidv4 } from "uuid";
import cors from "cors"
const app = express();
app.use(cors())
app.get("/start-task", async (req, res) =>
{
  const jobId = uuidv4();

  console.log("Adding job:", jobId);

  await taskQueue.add("task", { jobId });

  res.json({
    message: "Task started",
    jobId
  });
});

app.listen(5000, () =>
{
  console.log("Server running on 5000");
});