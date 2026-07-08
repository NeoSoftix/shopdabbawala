import stripe from "../../config/stripe.js"

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
