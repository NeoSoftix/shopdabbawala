export const getRecurring = (days) => {
  if (days <= 0) {
    throw new Error("Invalid validity days");
  }

  if (days % 365 === 0) {
    return {
      interval: "year",
      interval_count: days / 365,
    };
  }

  if (days % 30 === 0) {
    return {
      interval: "month",
      interval_count: days / 30,
    };
  }

  if (days % 7 === 0) {
    return {
      interval: "week",
      interval_count: days / 7,
    };
  }

  return {
    interval: "day",
    interval_count: days,
  };
};