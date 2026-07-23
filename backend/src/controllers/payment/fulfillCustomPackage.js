import Payment from "../../models/payment.model.js"
import Subscription from "../../models/Subcription.model.js"

// -------- CUSTOM PACKAGE fulfillment branch (extracted from fulfillOrder) --------
// Can run concurrently with the saveCheckoutDetails fallback (webhook vs. the
// user landing on /payment-success and submitting their pre-filled details
// before the webhook arrives) - both racing to fulfill the same payment
// would otherwise create two Subscriptions for one charge. Create
// optimistically, then atomically claim payment.subscription; if we lose the
// race, discard the extra Subscription instead of leaving it attached.
export const fulfillCustomPackage = async (session, payment) => {
  if (payment.subscription) return;

  const subscription = await Subscription.create({
    user: session.metadata.userId,
    stripeSubscriptionId: session.subscription,

    mealSize: session.metadata.mealSize,
    preference: session.metadata.preference,
    duration: session.metadata.duration,
    durationDays: Number(session.metadata.durationDays) || undefined,
    meals: session.metadata.meals,
    quantity: Number(session.metadata.quantity),
    deliveryMethod: session.metadata.deliveryMethod,
    price: Number(session.metadata.price) / 100, // metadata.price is stored in cents
    totalMeals: Number(session.metadata.totalMeals),
    mealsUsed: 0,
    startDate: new Date(session.metadata.startDate),
    endDate: new Date(session.metadata.endDate),
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
};
