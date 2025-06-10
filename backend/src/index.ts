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

import CategoryRouter from "./routes/categories";

import TagRouter from "./routes/tags";

import UserRouter from "./routes/user";

import loginRouter from "./routes/login";

import {
  zodErrorMiddleware,
  mongooseErrorMiddleware,
  genericErrorMiddleware,
} from "./middleware/errorMiddleware";

app.use("/api/login", loginRouter);
app.use("/api/product", ProductRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/tag", TagRouter);
app.use("/api/user", UserRouter);

app.get("/", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use(zodErrorMiddleware);
app.use(mongooseErrorMiddleware);
app.use(genericErrorMiddleware);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
