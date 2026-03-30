import { Queue } from "bullmq";
import { connection } from "./connection.js";
export const taskQueue=new Queue("task-queue",{
  connection
})