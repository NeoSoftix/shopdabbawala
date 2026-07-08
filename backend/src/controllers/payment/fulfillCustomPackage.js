import Subscription from "../../models/Subcription.model.js"

// -------- CUSTOM PACKAGE fulfillment branch (extracted from fulfillOrder) --------
export const fulfillCustomPackage = async (session, payment) => {
  const subscription = await Subscription.create({
    user: session.metadata.userId,
    stripeSubscriptionId: session.subscription,

    mealSize: session.metadata.mealSize,
    preference: session.metadata.preference,
    duration: session.metadata.duration,
    meals: session.metadata.meals,
    quantity: Number(session.metadata.quantity),
    deliveryMethod: session.metadata.deliveryMethod,
    price: Number(session.metadata.price),
    totalMeals: Number(session.metadata.totalMeals),
    mealsUsed: 0,
    maxItemsPerMeal: Number(session.metadata.maxItemsPerMeal),
    startDate: new Date(session.metadata.startDate),
    endDate: new Date(session.metadata.endDate),
  });

  payment.subscription = subscription._id;
  await payment.save();
};
