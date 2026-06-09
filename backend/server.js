import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import mealRoutes from "./src/routes/meal.route.js";
import itemRoutes from "./src/routes/item.routes.js";
import addOnRoutes from "./src/routes/addOns.routes.js"

const app = express();

app.use(express.json());

app.use(cookieParser());
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// auth routes
app.use("/api/auth", authRoutes);

// meals route
app.use("/api/meal", mealRoutes);

// category route
app.use("/api/category", categoryRoutes);

// Items routes
app.use("/api/items", itemRoutes);

// Add ons route
app.use("/api/addons", addOnRoutes)

app.listen(5000, () => {
  console.log("Server running on 5000");
});
