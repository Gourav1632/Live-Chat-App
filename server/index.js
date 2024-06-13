import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
import userRoutes from "./routes/userRoute.js";
import messageRoute from "./routes/messagesRoute.js";
import {Server} from "socket.io";

const app = express();
app.use(express.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '100mb', extended: true }));


env.config();

app.use(express.json());


app.use(cors())

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoute)


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log("Connected to database.");
    }catch(err){
        console.log("Failed to connect.");
        console.log(err);
    }
  }

connectDB();
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server running on port: ${process.env.PORT}`);
})

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    const isOnline = onlineUsers.has(userId);
    io.emit("onlineStatus", { userId, isOnline});
  });

  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          const isOnline = onlineUsers.has(key);
          io.emit("onlineStatus", { key, isOnline });
          break;
        }
    }
});

  socket.on("isOnline", (userId) => {
    const isOnline = onlineUsers.has(userId);
    socket.emit("onlineStatus", { userId, isOnline });
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
      socket.to(sendUserSocket).emit("recieve-new-message", data.from);
    }
  });

  socket.on("send-request", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("recieve-request", data.from);
    }
  });

  socket.on("accept-request",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("request-accepted",data.from);
    }
  })
  
});