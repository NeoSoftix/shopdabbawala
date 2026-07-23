import Package from "../../models/package.model.js"
import Payment from "../../models/payment.model.js"
import Subscription from "../../models/Subcription.model.js"

// -------- ADMIN PACKAGE fulfillment branch (extracted from fulfillOrder) --------
// Same race as fulfillCustomPackage - this can run concurrently with the
// saveCheckoutDetails fallback for the same payment. Guard with an atomic
// claim so only one of the two ever attaches a Subscription.
export const fulfillAdminPackage = async (session, payment) => {
  if (payment.subscription) return;

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
      preference: "Veg",
      duration: "Monthly",
      quantity: 1,
      deliveryMethod: "Delivery",
      stripeSubscriptionId: session.subscription,
      startDate,
      endDate,
    });

    const claimed = await Payment.findOneAndUpdate(
      { _id: payment._id, subscription: null },
      { $set: { subscription: subscription._id } },
      { new: true }
    );

    if (!claimed) {
      await subscription.deleteOne();
      return;
    }

    payment.subscription = claimed.subscription;
  }
};
