import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import env from "dotenv";
import userRoutes from "./routes/userRoute.js"
import messageRoute from "./routes/messagesRoute.js"

;

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
app.listen(process.env.PORT,()=>{
    console.log(`Server running on port: ${process.env.PORT}`);
})