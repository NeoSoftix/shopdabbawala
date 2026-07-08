import stripe from "../../config/stripe.js"
import Package from "../../models/package.model.js"
import Payment from "../../models/payment.model.js"

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

       success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
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
