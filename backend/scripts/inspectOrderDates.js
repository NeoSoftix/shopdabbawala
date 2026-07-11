import "dotenv/config";
import mongoose from "mongoose";
import Order from "../src/models/Order.model.js";
import MealSchedule from "../src/models/mealSchedule.model.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(10).select("date active status createdAt subscription");
  console.log("Recent Orders:");
  orders.forEach((o) => {
    console.log({
      id: o._id.toString(),
      date: o.date,
      dateISO: o.date?.toISOString(),
      active: o.active,
      status: o.status,
      createdAt: o.createdAt?.toISOString(),
    });
  });

  const schedules = await MealSchedule.find({}).sort({ updatedAt: -1 }).limit(5);
  console.log("\nRecent MealSchedules:");
  schedules.forEach((s) => {
    console.log({ id: s._id.toString(), days: s.schedule.map((d) => d.date?.toISOString()) });
  });

  console.log("\nServer timezone offset (minutes):", new Date().getTimezoneOffset());
  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
