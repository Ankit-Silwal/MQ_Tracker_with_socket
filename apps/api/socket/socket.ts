import { Server } from "socket.io";
import {Redis} from "ioredis";

const pub = new Redis();
const sub = new Redis();

export const io = new Server(4001, {
  cors: { origin: "*" }
});


io.on("connection",(socket)=>{
  console.log("Client connected successfully",socket.id);
  socket.on("join-room",(jobId)=>{
    console.log(`Socket ${socket.id} joined room ${jobId}`)
    socket.join(jobId)
  })
})

sub.subscribe("progress-updates");
sub.on("message",(channel,message)=>{
  const data=JSON.parse(message);
  io.to(data.jobId).emit("progress",data);
})

console.log(`Socket server is running at port no 4001`)