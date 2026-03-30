"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home()
{
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() =>
  {
    const socket = io("http://localhost:4001");

    socket.on("progress", (data) =>
    {
      if (data.jobId === jobId)
      {
        setProgress(data.progress);
      }
    });

    return () =>
    {
      socket.disconnect();
    };
  }, [jobId]);

  async function startTask()
  {
    const res = await fetch("http://localhost:3000/start-task");
    const data = await res.json();

    setJobId(data.jobId);
    setProgress(0);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Task Progress</h1>

      <button onClick={startTask}>
        Start Task
      </button>

      <h2>Progress: {progress}%</h2>

      <div
        style={{
          width: "300px",
          height: "20px",
          border: "1px solid black",
          marginTop: "10px"
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "green"
          }}
        />
      </div>
    </div>
  );
}