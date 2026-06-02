import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/category.routes.js"

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes )

app.listen(5000, () => {
  console.log("Server running on 5000");
});