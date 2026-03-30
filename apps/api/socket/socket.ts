import { Server } from "socket.io";
import {Redis} from "ioredis";

const pub = new Redis();
const sub = new Redis();

export const io = new Server(4001, {
  cors: { origin: "*" }
});

// Listen to Redis channel
sub.subscribe("progress-updates");

sub.on("message", (channel, message) =>
{
  if (channel === "progress-updates")
  {
    const data = JSON.parse(message);

    io.emit("progress", data);
  }
});

console.log("Socket server running on 4001");