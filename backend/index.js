import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";;
import urlRoutes from "./Routes/url.js";
import userRoutes from "./Routes/user.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("API is working");
});

mongoose.set("strictQuery", false);

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Failure to connect the database: " + error);
  }
};

const corsOptions = {
  origin: true, // Your URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/url", urlRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  connectdb();
  console.log("Server running on port " + port);
});
