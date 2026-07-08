import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"
import Subscription from "../../models/Subcription.model.js"
import { sendEmail } from "../../utils/email/sendEmail.js"
import { purchaseSuccessTemplate } from "../../utils/email/purchaseSuccessTemplate.js"
import User from "../../models/User.model.js"
import { setupScheduledSubscription } from "./stripeHelpers.js"

// save check out detilas
export const saveCheckoutDetails = async (req, res) => {
  try {
    const { name, email, address, pincode, sessionId } = req.body;

    if (!email || !sessionId) {
      return res.status(400).json({ success: false, message: "Email and session ID are required." });
    }

    const payment = await Payment.findOne({ stripeSessionId: sessionId }).populate("package").populate("subscription");
    let finalPayment = payment;
    console.log(payment);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    // Resilience: Retrieve subscription schedule ID directly from Stripe if the webhook hasn't updated the DB yet.
    let stripeSubscriptionScheduleId = payment.subscription?.stripeSubscriptionScheduleId;

    if (payment.paymentType === "CUSTOM_PACKAGE") {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.metadata.isScheduled === "true") {
          let subscription = payment.subscription;
          if (!subscription || !subscription.stripeSubscriptionScheduleId) {
            stripeSubscriptionScheduleId = await setupScheduledSubscription(session, payment, subscription);
          } else {
            stripeSubscriptionScheduleId = subscription.stripeSubscriptionScheduleId;
          }
        } else {
          if (session.subscription) {
            let subscription = payment.subscription;
            if (!subscription) {
              const startDateVal = session.metadata.startDate ? new Date(session.metadata.startDate) : new Date();
              const endDateVal = session.metadata.endDate ? new Date(session.metadata.endDate) : new Date();

              subscription = await Subscription.create({
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
                maxItemsPerMeal: Number(session.metadata.maxItemsPerMeal),
                stripeSubscriptionId: session.subscription,
                startDate: startDateVal,
                endDate: endDateVal,
                pincode: pincode,
              });

              payment.subscription = subscription._id;
              await payment.save();
            }

            if (!subscription.stripeSubscriptionScheduleId) {
              const stripeSub = await stripe.subscriptions.retrieve(session.subscription);
              if (stripeSub.schedule) {
                stripeSubscriptionScheduleId = stripeSub.schedule;
              } else {
                try {
                  const schedule = await stripe.subscriptionSchedules.create({
                    from_subscription: session.subscription,
                  });
                  stripeSubscriptionScheduleId = schedule.id;
                } catch (scheduleError) {
                  console.error("Failed to create subscription schedule on-the-fly:", scheduleError.message);
                }
              }

              if (stripeSubscriptionScheduleId) {
                subscription.stripeSubscriptionScheduleId = stripeSubscriptionScheduleId;
                await subscription.save();
              }
            } else {
              stripeSubscriptionScheduleId = subscription.stripeSubscriptionScheduleId;
            }
          }
        }
      } catch (stripeErr) {
        console.error("Stripe retrieval error in saveCheckoutDetails:", stripeErr.message);
      }
    } else if (payment.paymentType === "ADMIN_PACKAGE") {
      // Immediate fulfillment if webhook is delayed
      let subscription = payment.subscription;
      if (!subscription) {
        const pkg = payment.package;
        if (pkg) {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + pkg.validityDays);

          subscription = await Subscription.create({
            user: payment.user,
            package: pkg._id,
            mealSize: pkg.name,
            price: pkg.price,
            totalMeals: pkg.totalMeals,
            mealsUsed: 0,
            maxItemsPerMeal: pkg.maxItemsPerMeal,
            preference: "Veg",
            duration: "Monthly",
            quantity: 1,
            deliveryMethod: "Delivery",
            startDate,
            endDate,
            status: "active"
          });

          payment.subscription = subscription._id;
          payment.status = "paid";
          await payment.save();
        }
      }
    }


    // ========================================
    // SAVE PINCODE IN SUBSCRIPTION
    // ========================================

    const refreshedPayment = await Payment.findById(payment._id);

    console.log("PINCODE RECEIVED:", pincode);
    console.log(
      "SUBSCRIPTION ID:",
      refreshedPayment?.subscription
    );

    if (pincode && refreshedPayment?.subscription) {
      const updatedSubscription =
        await Subscription.findByIdAndUpdate(
          refreshedPayment.subscription,
          {
            $set: {
              pincode: String(pincode).trim(),
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

      console.log(
        "PINCODE SAVED:",
        updatedSubscription?.pincode
      );
    }

    // Always update User profile if name/phone/address/pincode is provided
    if (name || req.body.phone || address || pincode) {
      await User.findByIdAndUpdate(payment.user, {
        $set: {
          ...(name && { name }),
          ...(req.body.phone && { phone: req.body.phone }),
          ...(address && { address }),
          ...(pincode && { pincode }),
        }
      });
    }

    // Determine plan name and total meals
    let planName = "Custom Subscription";
    let totalMeals = "Varies";
    let amount = finalPayment.amount;

    if (finalPayment.paymentType === "ADMIN_PACKAGE" && finalPayment.package) {
      planName = finalPayment.package.name;
      totalMeals = finalPayment.package.totalMeals || "Pre-defined";
    } else if (finalPayment.paymentType === "CUSTOM_PACKAGE" && finalPayment.subscription) {
      planName = `Custom ${finalPayment.subscription.duration} Plan`;
      totalMeals = finalPayment.subscription.totalMeals;
    } else if (finalPayment.paymentType === "ADDON_ORDER") {
      planName = "Add-on Order";
      totalMeals = "N/A";
    }

    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });
    // Send the email
    const emailHtml = purchaseSuccessTemplate(name || "Customer", planName, amount, totalMeals);
    sendEmail(email, "Your Tiffin Delivery Subscription is Confirmed! 🎉", emailHtml)
      .catch(err => console.error("Background email sending failed:", err));

    return res.status(200).json({
      success: true,
      message: "Details saved and email sent.",
      stripeSubscriptionScheduleId,
    });
  } catch (error) {
    console.error("saveCheckoutDetails error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
