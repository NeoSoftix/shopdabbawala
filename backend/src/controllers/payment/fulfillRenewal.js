import Subscription from "../../models/Subcription.model.js"

// -------- RENEWAL fulfillment branch (extracted from fulfillOrder) --------
export const fulfillRenewal = async (session, payment) => {
  const subId = session.metadata.subscriptionId;
  const duration = session.metadata.duration;

  const newStartDate = new Date();
  const newEndDate = new Date(newStartDate);

  if (duration === "Trial") newEndDate.setDate(newEndDate.getDate() + 1);
  else if (duration === "Weekly") newEndDate.setDate(newEndDate.getDate() + 7);
  else if (duration === "Monthly") newEndDate.setMonth(newEndDate.getMonth() + 1);
  else if (duration === "Quarterly") newEndDate.setMonth(newEndDate.getMonth() + 3);

  const subscription = await Subscription.findByIdAndUpdate(
    subId,
    {
      status: "active",
      startDate: newStartDate,
      endDate: newEndDate,
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
