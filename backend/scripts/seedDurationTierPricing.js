import "dotenv/config";
import mongoose from "mongoose";
import DurationPlan from "../src/models/durationPlan.model.js";
import MealTier from "../src/models/mealTier.model.js";

const TARGET_MEAL_COUNTS = [16, 20];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const tiers = await MealTier.find({}, "_id name");
  if (tiers.length === 0) {
    console.error("No MealTier documents found — create Basic/Medium/Premium tiers first.");
    process.exit(1);
  }

  const dummyPriceFor = (tierName, totalMeals) => {
    const base = { Basic: 8, Medium: 9, Premium: 10 }[tierName] ?? 9;
    return Number((base * totalMeals * 0.9).toFixed(2));
  };

  for (const totalMeals of TARGET_MEAL_COUNTS) {
    const plan = await DurationPlan.findOne({ totalMeals });
    if (!plan) {
      console.warn(`No DurationPlan found with totalMeals=${totalMeals}, skipping.`);
      continue;
    }

    plan.tierPricing = tiers.map((tier) => ({
      mealTier: tier._id,
      pricePerMeal: dummyPriceFor(tier.name, totalMeals),
      discountPercentage: 10,
    }));

    await plan.save();
    console.log(`Updated tierPricing for "${totalMeals} meals" plan (${plan._id})`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
