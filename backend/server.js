import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/category.routes.js"
import mealRoutes from "./src/routes/meal.route.js"
import itemRoutes from "./src/routes/item.routes.js";


const app = express();

app.use(express.json());

connectDB();
console.log(process.env.JWT_SECRET);
app.use("/api/auth", authRoutes);
app.use("/api/meal", mealRoutes)
app.use("/api/category", categoryRoutes )
app.use("/api/items", itemRoutes);

app.listen(5000, () => {
  console.log("Server running on 5000");
});