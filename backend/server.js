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
import addOnRoutes from "./src/routes/addOns.routes.js";
import vendorRoutes from "./src/routes/vendor.routes.js";
import packageRoutes from "./src/routes/package.routes.js"
import subscriptionRoutes from "./src/routes/subcription.routes.js"
import paymentRoutes from "./src/routes/payment.routes.js"
import mealScheduleRoutes from "./src/routes/mealSchedule.routes.js";
import customerRoutes from "./src/routes/customer.routes.js"
import durationRoutes from "./src/routes/durationPlan.routes.js"
import mealTierRoutes from "./src/routes/mealTier.routes.js";
import orderRoutes from "./src/routes/order.routes.js";

const app = express();


app.use(cookieParser());
connectDB();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://tiffin-delivery-app.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || 
        origin.includes("localhost") || 
        origin.includes("vercel.app") || 
        origin.includes("render.com")
      ) {
        callback(null, true);
      } else {
        console.error("CORS Error: Origin not allowed ->", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
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
app.use("/api/addons", addOnRoutes);

// Vendor routes
app.use("/api/vendor", vendorRoutes);

// package routes
app.use("/api/packages", packageRoutes)

// custom package user
app.use("/api/subscriptions", subscriptionRoutes)

// payments routes
app.use("/api/payment", paymentRoutes);

// customer routes
app.use("/api/customer", customerRoutes);

// meal schedule routes
app.use("/api/meal-schedule", mealScheduleRoutes);

// duration set api 
app.use("/api/custom", durationRoutes)

// meal tier api
app.use("/api/meal-tiers", mealTierRoutes)

// orders route
app.use("/api/orders", orderRoutes);



app.listen(5000, () => {
  console.log("Server running on 5000");
});
