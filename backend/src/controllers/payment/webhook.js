import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"
import Subscription from "../../models/Subcription.model.js"
import { fulfillOrder } from "./fulfillOrder.js"
import { setupScheduledSubscription } from "./stripeHelpers.js"

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook Signature Error:", error.message);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const payment = await Payment.findOne({
          stripeSessionId: session.id,
        });

        if (!payment) {
          return res.status(404).json({
            success: false,
            message: "Payment not found",
          });
        }

        // Duplicate webhook protection
        if (payment.status === "paid") {
          return res.json({ received: true });
        }

        await fulfillOrder(session, payment);

        break;
      }

      case "customer.subscription.deleted": {
        const stripeSub = event.data.object;

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: stripeSub.id },
          { status: "expired", cancelAtPeriodEnd: false }
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const stripeSubId = invoice.subscription;
          const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);

          const newStartDate = new Date(stripeSub.current_period_start * 1000);
          const newEndDate = new Date(stripeSub.current_period_end * 1000);

          await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: stripeSubId },
            {
              status: "active",
              startDate: newStartDate,
              endDate: newEndDate,
              mealsUsed: 0
            }
          );
        }

        // -------- CUSTOM PACKAGE --------
        if (session.metadata.paymentType === "CUSTOM_PACKAGE") {
          if (session.metadata.isScheduled === "true") {
            try {
              // Retrieve payment again to populate subscription if it was populated in another thread
              const populatedPayment = await Payment.findOne({ stripeSessionId: session.id }).populate("subscription");
              await setupScheduledSubscription(session, populatedPayment, populatedPayment.subscription);
            } catch (err) {
              console.error("Failed to create scheduled subscription in webhook:", err.message);
            }
          } else {
            const subscription = await Subscription.create({
              user: session.metadata.userId,

              mealSize: session.metadata.mealSize,
              preference: session.metadata.preference,
              duration: session.metadata.duration,

              meals: session.metadata.meals,

              quantity: Number(session.metadata.quantity),

              deliveryMethod: session.metadata.deliveryMethod,

              price: Number(session.metadata.price),

              totalMeals: Number(session.metadata.totalMeals),

              mealsUsed: 0,

              maxItemsPerMeal: Number(
                session.metadata.maxItemsPerMeal
              ),

              stripeSubscriptionId: session.subscription,

              startDate: new Date(session.metadata.startDate),

              endDate: new Date(session.metadata.endDate),
            });

            payment.subscription = subscription._id;

            await payment.save();

            // Option 1: Transition the Stripe subscription into a Subscription Schedule
            if (session.subscription) {
              try {
                const schedule = await stripe.subscriptionSchedules.create({
                  from_subscription: session.subscription,
                });
                console.log("Subscription schedule created successfully:", schedule.id);

                subscription.stripeSubscriptionScheduleId = schedule.id;
                await subscription.save();
              } catch (scheduleError) {
                console.error("Failed to create subscription schedule in webhook:", scheduleError.message);
              }
            }
          }
        }

        break;
      }

      default:
        console.log(`Unhandled Event ${event.type}`);
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.log("Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
