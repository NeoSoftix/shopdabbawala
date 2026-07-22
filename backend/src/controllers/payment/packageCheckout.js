import stripe from "../../config/stripe.js"
import Package from "../../models/package.model.js"
import Payment from "../../models/payment.model.js"

// Core checkout-session creation, callable from anywhere with a resolved
// userId (not just from an authenticated Express request) - reused by both
// the web checkout route below and the WhatsApp bot.
export const buildPackageCheckoutSession = async ({ userId, packageId, extraMetadata = {} }) => {
  if (!packageId) {
    return { error: { status: 400, message: "Package Id is required" } };
  }

  if (!userId) {
    return { error: { status: 401, message: "Unauthorized. User context missing." } };
  }

  const pkg = await Package.findById(packageId);

  if (!pkg) {
    return { error: { status: 404, message: "Package not found" } };
  }

  if (!pkg.isActive) {
    return { error: { status: 400, message: "Package is inactive" } };
  }

  const hasDiscount =
    pkg.discountedPrice !== null &&
    pkg.discountedPrice !== undefined &&
    pkg.discountedPrice < pkg.price;

  const effectivePrice = hasDiscount ? pkg.discountedPrice : pkg.price;

  // Every admin-created package already gets a real Stripe Product on
  // create (see package.create.controller.js) - reuse that Product here
  // instead of inline product_data, which would spin up a brand-new
  // Product on every single purchase and flood the Stripe Product
  // catalog with duplicates. Only legacy packages created before that
  // sync existed would lack this, so lazily create+persist it as a
  // fallback.
  let stripeProductId = pkg.stripeProductId;
  if (!stripeProductId) {
    const stripeProduct = await stripe.products.create({
      name: pkg.name,
      description: pkg.description || "",
    });
    stripeProductId = stripeProduct.id;
    pkg.stripeProductId = stripeProductId;
    await pkg.save();
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    phone_number_collection: { enabled: true },

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",

          // Discounted price can differ from the package's synced
          // stripePriceId (which always tracks the full price), so a
          // fresh Price is created per checkout - but against the
          // existing shared Product, not a new one.
          product: stripeProductId,

          unit_amount: Math.max(effectivePrice * 100, 50), // Stripe requires minimum 50 cents

          recurring: {
            interval: "day",
            interval_count: pkg.validityDays,
          },
        },

        quantity: 1,
      },
    ],

    metadata: {
      userId: userId.toString(),
      packageId: pkg._id.toString(),
      paymentType: "ADMIN_PACKAGE",
      ...extraMetadata,
    },

     success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
  });

  await Payment.create({
    user: userId,
    package: pkg._id,

    paymentType: "ADMIN_PACKAGE",

    stripeSessionId: session.id,

    amount: effectivePrice,

    currency: "usd",

    status: "pending",

    metadata: session.metadata,
  });

  return { session, pkg };
};

export const createPackageCheckout = async (req, res) => {
  try {
    const { packageId } = req.body;

    const { session, error } = await buildPackageCheckoutSession({
      userId: req.user?.id,
      packageId,
    });

    if (error) {
      return res.status(error.status).json({ success: false, message: error.message });
    }

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
