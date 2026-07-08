import stripe from "../../config/stripe.js"
import Subscription from "../../models/Subcription.model.js"

// Helper function to setup a scheduled subscription from setup mode session
export const setupScheduledSubscription = async (session, payment, subscriptionObj = null) => {
  try {
    // 1. Retrieve setup intent to get payment method
    let paymentMethodId;
    if (session.setup_intent) {
      const setupIntent = await stripe.setupIntents.retrieve(session.setup_intent);
      paymentMethodId = setupIntent.payment_method;
    }

    if (paymentMethodId) {
      // 2. Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: session.customer,
      });

      // Set it as default invoice payment method
      await stripe.customers.update(session.customer, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // 3. Create Stripe Product & Price dynamically
    const product = await stripe.products.create({
      name: `${session.metadata.mealSize} Custom Package`,
      description: `${session.metadata.duration} Plan`,
    });

    const recurringMap = {
      Trial: { interval: "day", interval_count: 1 },
      Weekly: { interval: "week", interval_count: 1 },
      Monthly: { interval: "month", interval_count: 1 },
      Quarterly: { interval: "month", interval_count: 3 },
    };
    const recurring = recurringMap[session.metadata.duration] || { interval: "month", interval_count: 1 };

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Number(session.metadata.price),
      currency: "usd",
      recurring,
    });

    // 4. Create Subscription Schedule starting in the future
    const startDateSeconds = Math.floor(new Date(session.metadata.startDate).getTime() / 1000);

    const schedule = await stripe.subscriptionSchedules.create({
      customer: session.customer,
      start_date: startDateSeconds,
      end_behavior: "cancel",
      phases: [
        {
          items: [
            {
              price: price.id,
              quantity: Number(session.metadata.quantity || 1),
            },
          ],
          duration: {
            interval: recurring.interval,
            interval_count: recurring.interval_count,
          },
        },
      ],
    });

    console.log("Subscription schedule created from setup mode:", schedule.id);

    // 5. Update local Database Subscription
    let subscription = subscriptionObj;
    if (!subscription) {
      subscription = await Subscription.create({
        user: session.metadata.userId,
        mealSize: session.metadata.mealSize,
        preference: session.metadata.preference,
        duration: session.metadata.duration,
        meals: session.metadata.meals,
        quantity: Number(session.metadata.quantity),
        deliveryMethod: session.metadata.deliveryMethod,
        price: Number(session.metadata.price) / 100, // convert back to standard currency amount
        totalMeals: Number(session.metadata.totalMeals),
        mealsUsed: 0,
        maxItemsPerMeal: Number(session.metadata.maxItemsPerMeal),
        stripeSubscriptionId: schedule.subscription || "",
        stripeSubscriptionScheduleId: schedule.id,
        startDate: new Date(session.metadata.startDate),
        endDate: new Date(session.metadata.endDate),
      });

      payment.subscription = subscription._id;
      await payment.save();
    } else {
      subscription.stripeSubscriptionScheduleId = schedule.id;
      if (schedule.subscription) {
        subscription.stripeSubscriptionId = schedule.subscription;
      }
      await subscription.save();
    }

    return schedule.id;
  } catch (error) {
    console.error("setupScheduledSubscription error:", error);
    throw error;
  }
};
