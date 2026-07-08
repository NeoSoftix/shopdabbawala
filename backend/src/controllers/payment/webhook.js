import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"
import Subscription from "../../models/Subcription.model.js"
import { fulfillOrder } from "./fulfillOrder.js"

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
