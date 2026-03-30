import { Worker } from "bullmq";
import {Redis} from "ioredis";

const connection=new Redis();
const publisher=new Redis();

new Worker("task-queue",async (job)=>{
  const {jobId}=job.data;
  for(let i=0;i<10;i++){
    await new Promise((res)=>setTimeout(res,500))
    const progress=i*10;

    await publisher.publish("progress-updates",
      JSON.stringify({
        jobId,
        progress
      })
    )
  }
})