import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
const mongooseServerUri = process.env.MONGODB_URI as string;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongooseServerUri);
    console.log(`MongoDB connected to host: ${conn.connection.host}`);
  } catch {
    console.log("connection to db failed");
  }
};
connectDB();

import ProductRouter from "./routes/products";

app.use("/api/product", ProductRouter);

app.get("/", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
