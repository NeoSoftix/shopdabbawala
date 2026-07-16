import stripe from "../config/stripe.js";

// Custom plans (subcription.controller.js createSubscription) have a price
// that's computed fresh per checkout (meal tier, quantity, duration,
// discount, per-pincode delivery charge all vary) - there's no single
// "Package" document to attach a Stripe Product to like admin packages have.
// Without this, every custom-plan checkout used inline `product_data`, which
// makes Stripe silently create a brand-new Product for every single
// purchase, flooding the Product catalog with duplicates. Instead, all
// custom-plan checkouts share one Stripe Product (only the Price differs
// per checkout), found-or-created once and cached in memory for the life of
// the process.
const CUSTOM_PACKAGE_MARKER = "custom_package_shared";
let cachedProductId = null;

export const getOrCreateCustomPackageProduct = async () => {
  if (cachedProductId) return cachedProductId;

  const existing = await stripe.products.list({ limit: 100, active: true });
  const found = existing.data.find((p) => p.metadata?.appKey === CUSTOM_PACKAGE_MARKER);
  if (found) {
    cachedProductId = found.id;
    return cachedProductId;
  }

  const created = await stripe.products.create({
    name: "Custom Tiffin Plan",
    description: "User-configured custom meal subscription plan. Price varies per order based on meal tier, duration, quantity and delivery charge.",
    metadata: { appKey: CUSTOM_PACKAGE_MARKER },
  });

  cachedProductId = created.id;
  return cachedProductId;
};
