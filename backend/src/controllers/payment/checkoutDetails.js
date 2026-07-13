import stripe from "../../config/stripe.js"
import Payment from "../../models/payment.model.js"
import Subscription from "../../models/Subcription.model.js"
import Order from "../../models/Order.model.js"
import { sendEmail } from "../../utils/email/sendEmail.js"
import { purchaseSuccessTemplate } from "../../utils/email/purchaseSuccessTemplate.js"
import User from "../../models/User.model.js"
import { setupScheduledSubscription } from "./stripeHelpers.js"
import { findServingVendor } from "../../utils/findServingVendor.js"
import { notifyOrderEvent, notifyUser } from "../../utils/notifyOrderEvent.js"

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
                price: Number(session.metadata.price) / 100, // metadata.price is stored in cents
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

          const hasDiscount =
            pkg.discountedPrice !== null &&
            pkg.discountedPrice !== undefined &&
            pkg.discountedPrice < pkg.price;
          const effectivePrice = hasDiscount ? pkg.discountedPrice : pkg.price;

          let stripeSubscriptionId;
          try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            stripeSubscriptionId = session.subscription;
          } catch (stripeErr) {
            console.error("Stripe session retrieval error for ADMIN_PACKAGE:", stripeErr.message);
          }

          subscription = await Subscription.create({
            user: payment.user,
            package: pkg._id,
            mealSize: pkg.name,
            price: effectivePrice,
            totalMeals: pkg.totalMeals,
            mealsUsed: 0,
            maxItemsPerMeal: pkg.maxItemsPerMeal,
            preference: "Veg",
            duration: "Monthly",
            quantity: 1,
            deliveryMethod: "Delivery",
            stripeSubscriptionId,
            startDate,
            endDate,
            status: "active"
          });

          payment.subscription = subscription._id;
          payment.status = "paid";
          await payment.save();
        }
      }
    } else if (payment.paymentType === "ADDON_ORDER") {
      // Create the actual Order document now that we have the delivery
      // address, using the per-item quantity snapshot saved at checkout time.
      if (!payment.order && Array.isArray(payment.items) && payment.items.length > 0) {
        let deliveryAddress = address;
        if (!deliveryAddress) {
          const orderUser = await User.findById(payment.user).select("address");
          deliveryAddress = orderUser?.address;
        }

        const order = await Order.create({
          user: payment.user,
          deliveryAddress: deliveryAddress || "Not provided",
          addons: payment.items.map((it) => ({
            addon: it.addon,
            name: it.name,
            qty: it.qty,
            price: it.price,
          })),
          status: "Pending",
          deliveryMethod: "Delivery",
        });

        payment.order = order._id;
        payment.status = "paid";
        await payment.save();
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

    // Notify admin + the vendor serving this customer's pincode that a new
    // subscription was purchased, so the vendor knows to expect orders from
    // them. Guarded by purchaseNotified so a resubmitted form doesn't spam.
    if (
      !payment.purchaseNotified &&
      (finalPayment.paymentType === "ADMIN_PACKAGE" || finalPayment.paymentType === "CUSTOM_PACKAGE") &&
      refreshedPayment?.subscription
    ) {
      const purchasePincode = pincode || finalPayment.subscription?.pincode || "";
      const purchasePackageId = finalPayment.paymentType === "ADMIN_PACKAGE" ? finalPayment.package?._id : undefined;
      const vendor = purchasePincode ? await findServingVendor(purchasePincode, purchasePackageId) : null;
      const customerName = name || "A customer";

      await notifyOrderEvent({
        vendorId: vendor?._id,
        type: "payment",
        title: "New Subscription Purchase",
        message: `${customerName} purchased the ${planName} plan.`,
        emailHeading: "New Subscription Purchased",
        emailIntro: `${customerName} just purchased a new subscription. ${vendor ? `It has been matched to your service area (pincode ${purchasePincode}).` : "No serving vendor could be matched to their pincode yet."}`,
        emailLines: [
          { label: "Customer", value: customerName },
          { label: "Plan", value: planName },
          { label: "Amount", value: `$${amount}` },
          { label: "Pincode", value: purchasePincode || "Not provided" },
        ],
      });

      notifyUser({
        userId: payment.user,
        type: "payment",
        title: "Subscription Purchased",
        message: `You purchased the ${planName} plan! We'll start preparing your meals soon.`,
      });

      payment.purchaseNotified = true;
      await payment.save();
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
