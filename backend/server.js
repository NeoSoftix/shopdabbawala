import express from "express";
import http from "http";
import dns from "dns";
import dotenv from "dotenv";
import helmet from "helmet"
dotenv.config();

// Render (and several other cloud hosts) don't route outbound IPv6, but
// Node 18+ resolves DNS in whatever order the OS returns - which is often
// IPv6-first - so outbound connections (e.g. Gmail SMTP for nodemailer)
// fail with ENETUNREACH/ETIMEDOUT on an unreachable IPv6 address instead of
// falling back to IPv4. Forcing IPv4-first resolution fixes this app-wide.
dns.setDefaultResultOrder("ipv4first");

import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/socket/index.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/category.routes.js";
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
import notificationRoutes from "./src/routes/notification.routes.js";
import contactQueryRoutes from "./src/routes/contactQuery.routes.js";
import deliveryChargeRoutes from "./src/routes/deliveryCharge.routes.js";
import weeklyMenuRoutes from "./src/routes/weeklyMenu.routes.js";
import campaignRoutes from "./src/routes/campaignRoutes.js";
import templateRoutes from "./src/routes/templateRoutes.js";
import { startCampaignScheduler } from "./src/utils/campaignScheduler.js";
import { generalLimiter } from "./src/middleware/ratelimiter.middleware.js";
import { stripeWebhook } from "./src/controllers/payment.controller.js";

const app = express();

// helmet use for security
app.use(helmet());

// baseline rate limit for all routes
app.use(generalLimiter);

// middleware for cookieparser
app.use(cookieParser());

connectDB();

// Stripe webhook needs the raw request body to verify the signature, so it
// must be registered (with express.raw) before the global express.json()
// below - otherwise json() consumes the body first and signature
// verification always fails, silently breaking webhook-driven fulfillment.
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

//middelare for jso parsing
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

// vendor notification routes
app.use("/api/notifications", notificationRoutes);

// contact us form routes
app.use("/api/contact", contactQueryRoutes);

// delivery charge routes
app.use("/api/delivery-charges", deliveryChargeRoutes);

// weekly per-category menu routes
app.use("/api/weekly-menu", weeklyMenuRoutes);

// campaigns & templates
app.use("/api/campaigns", campaignRoutes);
app.use("/api/templates", templateRoutes);


const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startCampaignScheduler();
});

httpServer.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
  if (error.code === "EADDRINUSE") {
    console.error(`${bind} is already in use. Close the process using it or set a different PORT in .env.`);
    process.exit(1);
  }

  throw error;
});
