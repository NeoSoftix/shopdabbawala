import stripe from "../config/stripe.js"
import Package from "../models/package.model.js"
import Payment from "../models/payment.model.js"
import Subscription from "../models/Subcription.model.js"
import AddOn from "../models/addOns.model.js"
import { sendEmail } from "../utils/email/sendEmail.js"
import { purchaseSuccessTemplate } from "../utils/email/purchaseSuccessTemplate.js"
import User from "../models/User.model.js"

// Helper function to setup a scheduled subscription from setup mode session
const setupScheduledSubscription = async (session, payment, subscriptionObj = null) => {
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

export const createPackageCheckout = async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package Id is required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User context missing.",
      });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    if (!pkg.isActive) {
      return res.status(400).json({
        success: false,
        message: "Package is inactive",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      phone_number_collection: { enabled: true },

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: pkg.name,
              description: pkg.description,
            },

            unit_amount: Math.max(pkg.price * 100, 4000), // Stripe requires minimum 50 cents / 40 INR
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId: req.user.id,
        packageId: pkg._id.toString(),
        paymentType: "ADMIN_PACKAGE",
      },

      success_url: `https://tiffin-delivery-app.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `https://tiffin-delivery-app.vercel.app/payment-cancel`,
    });

    await Payment.create({
      user: req.user.id,
      package: pkg._id,

      paymentType: "ADMIN_PACKAGE",

      stripeSessionId: session.id,

      amount: pkg.price,

      currency: "inr",

      status: "pending",

      metadata: session.metadata,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.log("Package Checkout Error", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// One-time checkout for a cart of add-on items (User Dashboard "Add-ons" section)
export const createAddonCheckout = async (req, res) => {
  try {
    const { items } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User context missing.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const addonIds = items.map((item) => item.id);
    const addons = await AddOn.find({ _id: { $in: addonIds }, isActive: true });

    const line_items = items
      .map((cartItem) => {
        const addon = addons.find((a) => a._id.toString() === cartItem.id);
        if (!addon) return null;

        const quantity = Math.max(1, Number(cartItem.quantity) || 1);

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: addon.name,
              description: addon.description || undefined,
            },
            unit_amount: Math.round(addon.price * 100),
          },
          quantity,
        };
      })
      .filter(Boolean);

    if (line_items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid add-ons found in your cart.",
      });
    }

    const totalAmount = line_items.reduce(
      (sum, li) => sum + li.price_data.unit_amount * li.quantity,
      0,
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      phone_number_collection: { enabled: true },
      payment_method_types: ["card"],
      line_items,
      metadata: {
        userId: req.user.id,
        paymentType: "ADDON_ORDER",
      },
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    await Payment.create({
      user: req.user.id,
      paymentType: "ADDON_ORDER",
      stripeSessionId: session.id,
      amount: Math.round(totalAmount / 100),
      currency: "inr",
      status: "pending",
      metadata: session.metadata,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Addon Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// weeb hook
// -------- FULFILL ORDER HELPER --------
const fulfillOrder = async (session, payment) => {
  payment.status = "paid";
  payment.paymentIntentId = session.payment_intent;
  payment.paidAt = new Date();

  await payment.save();

  // -------- ADMIN PACKAGE --------
  if (session.metadata?.paymentType === "ADMIN_PACKAGE") {
    const pkg = await Package.findById(session.metadata.packageId);

    if (pkg) {
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + pkg.validityDays);

      const subscription = await Subscription.create({
        user: session.metadata.userId,
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
      });

      payment.subscription = subscription._id;
      await payment.save();
    }
  }

  // -------- CUSTOM PACKAGE --------
  if (session.metadata?.paymentType === "CUSTOM_PACKAGE") {
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
  }

  // -------- RENEWAL --------
  if (session.metadata?.paymentType === "RENEWAL") {
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
  }
};

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

// Create subscription schedule
export const createScheduledSubscription = async (req, res) => {
  try {
    const { customerId, priceId, startDate, durationInterval = "week", durationCount = 1 } = req.body;

    if (!customerId || !priceId || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Customer ID, Price ID, and Start Date are required.",
      });
    }

    // Convert startDate to a Unix timestamp in seconds
    const parsedDate = new Date(startDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date format.",
      });
    }
    const startTimestamp = Math.floor(parsedDate.getTime() / 1000);

    // Create the subscription schedule on Stripe
    const schedule = await stripe.subscriptionSchedules.create({
      customer: customerId,
      start_date: startTimestamp,
      end_behavior: "cancel",
      phases: [
        {
          items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          duration: {
            interval: durationInterval,
            interval_count: Number(durationCount),
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Subscription schedule created successfully.",
      scheduleId: schedule.id,
      schedule,
    });
  } catch (error) {
    console.error("Create Subscription Schedule Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create subscription schedule.",
    });
  }
};

export const getCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return res.status(200).json({
      success: true,
      customer_details: session.customer_details,
    });
  } catch (error) {
    console.error("Get Session Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};