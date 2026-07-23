import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"
import Subscription from "../../models/Subcription.model.js"
import User from "../../models/User.model.js"
import { fulfillOrder } from "./fulfillOrder.js"
import { notifyUser, notifyOrderEvent } from "../../utils/notifyOrderEvent.js"
import { sendWhatsApp } from "../../utils/sms/sendWhatsApp.js"

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

        // Atomically claim this session for fulfillment. Stripe can and
        // does redeliver the same event, and a slow first delivery could
        // still be mid-fulfillment when the retry arrives - a plain
        // findOne + "if not paid" check-then-act lets both deliveries pass
        // the check and both call fulfillOrder, double-creating the
        // Subscription/Order. Only one findOneAndUpdate can flip status
        // from non-"paid" to "paid" and get the document back; the other
        // gets null and skips fulfillment entirely.
        const payment = await Payment.findOneAndUpdate(
          { stripeSessionId: session.id, status: { $ne: "paid" } },
          {
            $set: {
              status: "paid",
              paymentIntentId: session.payment_intent,
              paidAt: new Date(),
            },
          },
          { new: true }
        );

        if (!payment) {
          // Either no Payment record exists for this session, or another
          // delivery of this same event already claimed and fulfilled it -
          // acknowledge so Stripe stops retrying.
          return res.json({ received: true });
        }

        await fulfillOrder(session, payment);

        // Notify the customer immediately - don't wait for them to land on
        // the thank-you page and fill in their details (they may close the
        // tab right after paying). Guarded by purchaseNotified so the
        // later, fuller notification in saveCheckoutDetails doesn't repeat.
        const paymentType = session.metadata?.paymentType;
        if (
          (paymentType === "ADMIN_PACKAGE" || paymentType === "CUSTOM_PACKAGE") &&
          !payment.purchaseNotified
        ) {
          const refreshedPayment = await Payment.findById(payment._id).populate("subscription").populate("package");

          notifyUser({
            userId: payment.user,
            type: "payment",
            title: "Subscription Purchased",
            message: "Your payment was successful! We'll start preparing your meals soon.",
          });

          if (!refreshedPayment?.subscription?.pincode) {
            notifyUser({
              userId: payment.user,
              type: "payment",
              title: "Complete Your Delivery Details",
              message: "We're missing your delivery address and pincode - please add them from your account so we can start delivering your meals.",
            });
          }

          payment.purchaseNotified = true;
          await payment.save();

          // WhatsApp-originated purchases don't have a browser session to
          // land the user back on - send the confirmation directly instead,
          // with a link straight to the meal scheduler so they know the
          // very next thing to do.
          if (session.metadata?.source === "whatsapp" && session.metadata?.whatsappPhone) {
            const planName = refreshedPayment?.package?.name || "your";
            sendWhatsApp(
              session.metadata.whatsappPhone,
              `🎉 Your payment is successful! Your ${planName} plan is now active.\n\n` +
              `You can now go to our website and schedule your meals: ${process.env.FRONTEND_URL}/dashboard\n\n` +
              `Thank you for choosing Shop Dabba Wala! 🍲`
            ).catch((err) => console.error("WhatsApp confirmation failed:", err.message || err));
          }
        }

        // Notify admin of the new purchase from right here, not just from
        // saveCheckoutDetails - that fallback only runs if the customer
        // stays on the page and submits the post-payment delivery-details
        // form, which many customers skip entirely after seeing "Payment
        // Successful!". This is the one reliable, server-side trigger that
        // always fires once Stripe confirms payment, independent of what
        // the customer's browser does next. Guarded by its own flag
        // (separate from purchaseNotified/customer notification) so it
        // never duplicates and never blocks the vendor-matching notification
        // saveCheckoutDetails still sends once the pincode is known.
        if (
          (paymentType === "ADMIN_PACKAGE" || paymentType === "CUSTOM_PACKAGE") &&
          !payment.adminNotified
        ) {
          const refreshedForAdmin = await Payment.findById(payment._id).populate("subscription").populate("package");
          const buyer = await User.findById(payment.user).select("name");
          const customerName = buyer?.name || "A customer";

          let planName = "Custom Subscription";
          if (paymentType === "ADMIN_PACKAGE" && refreshedForAdmin?.package) {
            planName = refreshedForAdmin.package.name;
          } else if (paymentType === "CUSTOM_PACKAGE" && refreshedForAdmin?.subscription) {
            planName = `Custom ${refreshedForAdmin.subscription.duration} Plan`;
          }

          await notifyOrderEvent({
            type: "payment",
            title: "New Subscription Purchase",
            message: `${customerName} purchased the ${planName} plan.`,
            emailHeading: "New Subscription Purchased",
            emailIntro: `${customerName} just purchased a new subscription.`,
            emailLines: [
              { label: "Customer", value: customerName },
              { label: "Plan", value: planName },
              { label: "Amount", value: `$${refreshedForAdmin?.amount ?? payment.amount}` },
            ],
          });

          payment.adminNotified = true;
          await payment.save();
        }

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
