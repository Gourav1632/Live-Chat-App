import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
import userRoutes from "./routes/userRoute.js";
import messageRoute from "./routes/messagesRoute.js";
import {Server} from "socket.io";

const app = express();

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
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});