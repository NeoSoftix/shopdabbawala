import mongoose from "mongoose"
import stripe from "../config/stripe.js";
import Subscription from "../models/Subcription.model.js";
import Meal from "../models/meals.model.js";
import Payment from "../models/payment.model.js";


// create subscription
export const createSubscription = async (req, res) => {
  try {
    const {
      mealSize,
      preference,
      duration,
      meals,
      quantity = 1,
      deliveryMethod,
      startDate,
    } = req.body;

    // Required Fields
    if (
      !mealSize ||
      !preference ||
      !duration ||
      !meals ||
      !deliveryMethod ||
      !startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    // Validate Meal Id
    if (!mongoose.Types.ObjectId.isValid(meals)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Meal Id.",
      });
    }

    const meal = await Meal.findById(meals);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found.",
      });
    }

    // Meal Plans
    const mealPlans = {
      Basic: {
        price: 299,
        totalMeals: 15,
        maxItemsPerMeal: 4,
      },
      Medium: {
        price: 499,
        totalMeals: 30,
        maxItemsPerMeal: 8,
      },
      Premium: {
        price: 799,
        totalMeals: 30,
        maxItemsPerMeal: 10,
      },
    };

    const selectedPlan = mealPlans[mealSize];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal size.",
      });
    }

    const calculatedStartDate = new Date(startDate);

    if (isNaN(calculatedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    const endDate = new Date(calculatedStartDate);

    switch (duration) {
      case "Trial":
        endDate.setDate(endDate.getDate() + 1);
        break;

      case "Weekly":
        endDate.setDate(endDate.getDate() + 7);
        break;

      case "Monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case "Quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid duration.",
        });
    }

    // Recurring Mapping
    const recurringMap = {
      Trial: {
        interval: "day",
        interval_count: 1,
      },
      Weekly: {
        interval: "week",
        interval_count: 1,
      },
      Monthly: {
        interval: "month",
        interval_count: 1,
      },
      Quarterly: {
        interval: "month",
        interval_count: 3,
      },
    };

    const recurring = recurringMap[duration];

    // Checkout Session with inline subscription price_data (does not create catalog products)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${mealSize} Custom Package`,
              description: `${duration} Plan`,
            },
            unit_amount: selectedPlan.price * 100,
            recurring: {
              interval: recurring.interval,
              interval_count: recurring.interval_count,
            },
          },
          quantity,
        },
      ],

      metadata: {
        userId: req.user.id,
        paymentType: "CUSTOM_PACKAGE",

        mealSize,
        preference,
        duration,

        meals: meal._id.toString(),

        quantity: quantity.toString(),

        deliveryMethod,

        price: selectedPlan.price.toString(),

        totalMeals: selectedPlan.totalMeals.toString(),

        maxItemsPerMeal:
          selectedPlan.maxItemsPerMeal.toString(),

        startDate: calculatedStartDate.toISOString(),

        endDate: endDate.toISOString(),
      },

      success_url: `${process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancel`,
    });

    await Payment.create({
      user: req.user.id,

      paymentType: "CUSTOM_PACKAGE",

      stripeSessionId: session.id,

      amount: selectedPlan.price * quantity,

      currency: "inr",

      status: "pending",

      metadata: session.metadata,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};