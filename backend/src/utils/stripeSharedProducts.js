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

  // No `active` filter here - the shared product is deliberately created as
  // inactive (see below) so it stays out of the admin's default "Active"
  // Product catalog view, so an active-only list would never find it again.
  const existing = await stripe.products.list({ limit: 100 });
  const found = existing.data.find((p) => p.metadata?.appKey === CUSTOM_PACKAGE_MARKER);
  if (found) {
    cachedProductId = found.id;
    return cachedProductId;
  }

  // Marked inactive on purpose: this Product only exists so Stripe has
  // somewhere to hang custom-plan Prices - it isn't a real sellable catalog
  // item the admin manages, unlike admin-created Packages. `active: false`
  // keeps it out of the Product catalog's default "Active" list (it only
  // shows under "Archived"), without affecting checkout - Checkout Sessions
  // that reference a product/price by id work regardless of `active`.
  const created = await stripe.products.create({
    name: "Custom Tiffin Plan",
    description: "User-configured custom meal subscription plan. Price varies per order based on meal tier, duration, quantity and delivery charge.",
    metadata: { appKey: CUSTOM_PACKAGE_MARKER },
    active: false,
  });

  cachedProductId = created.id;
  return cachedProductId;
};
