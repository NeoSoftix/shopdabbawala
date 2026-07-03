import Subscription from "../models/Subcription.model.js";
import Meal from "../models/meals.model.js"
import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import Payment from "../models/payment.model.js";



// cretae custom subscrition

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

    // Check Meal Exists
    const meal = await Meal.findById(meals);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found.",
      });
    }

    // Meal Plan Configuration
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

    // Validate Start Date
    const calculatedStartDate = new Date(startDate);

    if (isNaN(calculatedStartDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    // Calculate End Date
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

    // Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: `${mealSize} Custom Package`,
              description: `${duration} Plan`,
            },

            unit_amount: selectedPlan.price * quantity * 100,
          },

          quantity: 1,
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

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    // Save Pending Payment
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
    console.error("Create Custom Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
