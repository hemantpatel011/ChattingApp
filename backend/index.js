import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import AuthRoutes from "./src/routes/authRoutes.js";
import UserRoutes from "./src/routes/userRoutes.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieparser());
app.use(morgan("dev"));

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Server is Connected",
    status: "success",
  });
});

app.use((err, req, res, next) => {
  const error = err.message || "Something went wrong";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: "Internal Server Error",
    error,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
