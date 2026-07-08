// Fallback Images (agar backend se image na mile)
export const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
];

// Gradients array
export const GRADIENTS = [
  "from-[#F3FBF7] via-white to-[#FFF5F5]",
  "from-[#FFF5F5] via-white to-[#FFF0F5]",
  "from-[#F5F0FA] via-white to-[#FFF5F5]",
  "from-[#F0F9FF] via-white to-[#FFF5F5]",
];

// Maps raw backend package payloads into the display-ready shape the UI expects.
export function formatPackages(rawPackages) {
  return rawPackages.map((pkg, index) => {
    const hasDiscount =
      pkg.discountedPrice != null && pkg.discountedPrice < pkg.price;

    return {
    ...pkg,
    title: pkg.name ? pkg.name.toUpperCase() : "PLAN",
    hasDiscount,
    price: hasDiscount
      ? `$${pkg.discountedPrice}`
      : pkg.price
        ? `$${pkg.price}`
        : "$0",
    originalPrice: pkg.price ? `$${pkg.price}` : "$0",
    meals: `${pkg.totalMeals || 0} Meals / ${pkg.validityDays || 0} Days`,
    image:
      pkg.image?.url ||
      pkg.image ||
      DEFAULT_IMAGES[index % DEFAULT_IMAGES.length],
    gradient: GRADIENTS[index % GRADIENTS.length],
    features: pkg.description
      ? pkg.description.split(", ")
      : [
          "Healthy Meals",
          "Fresh Ingredients",
          `Max Items: ${pkg.maxItemsPerMeal || 3}`,
          "Macro-Friendly Plan",
        ],
    popular: index === 1,
    };
  });
}

// Determines how far (in px) adjacent carousel cards sit from the active card,
// based on the current viewport width.
export function getResponsiveOffset() {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 480) return 140;
    if (window.innerWidth < 768) return 240;
  }
  return 370;
}

// Whether the user already has an active subscription matching this package.
export function isCurrentPlan(pkg, activeSubscriptions) {
  return activeSubscriptions.some(
    (sub) => sub.package?._id === pkg._id || sub.mealSize === pkg.name,
  );
}
