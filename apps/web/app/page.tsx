"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home()
{
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // 🔌 Initialize socket ONCE
  useEffect(() =>
  {
    const s = io("http://localhost:4001");

    s.on("connect", () =>
    {
      console.log("Connected:", s.id);
    });

    s.on("progress", (data) =>
    {
      console.log("Received:", data);

      setProgress(data.progress);
    });

    setSocket(s);

    return () =>
    {
      s.disconnect();
    };
  }, []);

  // 🚀 Start task
  async function startTask()
  {
    try
    {
      const res = await fetch("http://localhost:5000/start-task");

      if (!res.ok)
      {
        const text = await res.text();
        console.error("Server error:", text);
        return;
      }

      const data = await res.json();

      console.log("Job started:", data);

      setJobId(data.jobId);
      setProgress(0);

      // 🟢 Join room AFTER getting jobId
      socket?.emit("join-room", data.jobId);
    }
    catch (err)
    {
      console.error("Fetch failed:", err);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Task Progress</h1>

      <button onClick={startTask}>
        Start Task
      </button>

      <h3>Job ID: {jobId}</h3>

      <h2>Progress: {progress}%</h2>

      {/* Progress Bar */}
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
            backgroundColor: "green",
            transition: "width 0.3s ease"
          }}
        />
      </div>
    </div>
  );
}