import Package from "../../models/package.model.js"
import Subscription from "../../models/Subcription.model.js"

// -------- ADMIN PACKAGE fulfillment branch (extracted from fulfillOrder) --------
export const fulfillAdminPackage = async (session, payment) => {
  const pkg = await Package.findById(session.metadata.packageId);

  if (pkg) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + pkg.validityDays);

    const hasDiscount =
      pkg.discountedPrice !== null &&
      pkg.discountedPrice !== undefined &&
      pkg.discountedPrice < pkg.price;
    const effectivePrice = hasDiscount ? pkg.discountedPrice : pkg.price;

    const subscription = await Subscription.create({
      user: session.metadata.userId,
      package: pkg._id,
      mealSize: pkg.name,
      price: effectivePrice,
      totalMeals: pkg.totalMeals,
      mealsUsed: 0,
      maxItemsPerMeal: pkg.maxItemsPerMeal,
      preference: "Veg",
      duration: "Monthly",
      quantity: 1,
      deliveryMethod: "Delivery",
      stripeSubscriptionId: session.subscription,
      startDate,
      endDate,
    });

    payment.subscription = subscription._id;
    await payment.save();
  }
};
