import Subscription from "../../models/Subcription.model.js"

// -------- RENEWAL fulfillment branch (extracted from fulfillOrder) --------
export const fulfillRenewal = async (session, payment) => {
  const subId = session.metadata.subscriptionId;
  const durationDays = Number(session.metadata.durationDays) || 30;

  const newStartDate = new Date();
  const newEndDate = new Date(newStartDate);
  newEndDate.setDate(newEndDate.getDate() + durationDays);

  const subscription = await Subscription.findByIdAndUpdate(
    subId,
    {
      status: "active",
      startDate: newStartDate,
      endDate: newEndDate,
      durationDays,
      mealsUsed: 0,
      cancelAtPeriodEnd: false,
      stripeSubscriptionId: session.subscription,
    },
    { new: true }
  );

  if (subscription) {
    payment.subscription = subscription._id;
    await payment.save();
  }
};
