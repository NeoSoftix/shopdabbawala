// Shared helpers for package controllers

// Maps supported validityDays values to Stripe recurring price config
export const recurringMap = {
  7: { interval: "week", interval_count: 1 },
  15: { interval: "day", interval_count: 15 },
  30: { interval: "month", interval_count: 1 },
  90: { interval: "month", interval_count: 3 },
  180: { interval: "month", interval_count: 6 },
  365: { interval: "year", interval_count: 1 },
};
