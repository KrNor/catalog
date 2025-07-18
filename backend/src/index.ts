import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// origin: process.env.FRONTEND_URL || "http://localhost:5173", // for security so that only the frontend can make the requests
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL as string,
    ],
  })
);
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

app.use(cookieParser());

import ProductRouter from "./routes/products";

import CategoryRouter from "./routes/categories";

import TagRouter from "./routes/tags";

// import UserRouter from "./routes/user";

import AuthRouter from "./routes/auth";

import FilterRounter from "./routes/filters";

import {
  zodErrorMiddleware,
  mongooseErrorMiddleware,
  genericErrorMiddleware,
  jwtErrorMiddleware,
} from "./middleware/errorMiddleware";

app.use("/api/auth", AuthRouter);
app.use("/api/product", ProductRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/tag", TagRouter);
app.use("/api/filter", FilterRounter);

// for future probable user creation
// app.use("/api/user", UserRouter);

app.get("/", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.get("/{*splat}", (_req, res) => {
  res.status(400).json({ error: "Bad request" });
});
app.delete("/{*splat}", (_req, res) => {
  res.status(400).json({ error: "Bad request" });
});
app.post("/{*splat}", (_req, res) => {
  res.status(400).json({ error: "Bad request" });
});

app.use(jwtErrorMiddleware);
app.use(zodErrorMiddleware);
app.use(mongooseErrorMiddleware);
app.use(genericErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
