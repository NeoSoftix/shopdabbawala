import "dotenv/config";
import mongoose from "mongoose";
import Order from "../src/models/Order.model.js";
import MealSchedule from "../src/models/mealSchedule.model.js";

// Old buggy code normalized dates with the server's local timezone
// (IST, UTC+5:30) instead of UTC, which stored the intended calendar day as
// the previous day at 18:30:00.000Z (e.g. intended "2026-07-11" got saved as
// "2026-07-10T18:30:00.000Z"). Shifting it forward by 330 minutes recovers
// the correct UTC-midnight value the current code expects.
const SHIFT_MS = 330 * 60 * 1000;

const isShifted = (date) =>
  date instanceof Date &&
  date.getUTCHours() === 18 &&
  date.getUTCMinutes() === 30 &&
  date.getUTCSeconds() === 0 &&
  date.getUTCMilliseconds() === 0;

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const orders = await Order.find({});
  let fixedOrders = 0;
  for (const order of orders) {
    if (isShifted(order.date)) {
      order.date = new Date(order.date.getTime() + SHIFT_MS);
      await order.save();
      fixedOrders++;
    }
  }
  console.log(`Fixed ${fixedOrders} Order date(s).`);

  const schedules = await MealSchedule.find({});
  let fixedSchedules = 0;
  for (const schedule of schedules) {
    let changed = false;
    schedule.schedule.forEach((day) => {
      if (isShifted(day.date)) {
        day.date = new Date(day.date.getTime() + SHIFT_MS);
        changed = true;
      }
    });
    if (changed) {
      await schedule.save();
      fixedSchedules++;
    }
  }
  console.log(`Fixed ${fixedSchedules} MealSchedule document(s).`);

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
