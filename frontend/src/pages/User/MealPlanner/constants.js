// "YYYY-MM-DD" key for a date - used to key weeklyPlan/dayStatus objects and
// as the payload value sent to the backend (which stores real Date values now).
export const formatDateKey = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// True when the given date falls strictly before today (time-of-day ignored).
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

// True when date falls after the subscription's validity window.
export const isBeyondSubscription = (date, subscription) => {
  if (!subscription?.endDate) return false;
  const end = new Date(subscription.endDate);
  end.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate > end;
};

// True when a date is outside the range the user is actually allowed to
// schedule meals for: not in the past, and within the plan's validity.
export const isSelectableDate = (date, subscription) =>
  !isPastDate(date) && !isBeyondSubscription(date, subscription);

// All calendar dates within [startDate, endDate] inclusive - the full window
// a subscription is valid for (e.g. every day of a 1-month plan).
export const getSubscriptionDateRange = (subscription) => {
  if (!subscription?.startDate || !subscription?.endDate) return [];

  const dates = [];
  const cur = new Date(subscription.startDate);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(subscription.endDate);
  last.setHours(0, 0, 0, 0);

  while (cur <= last) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

export const weekdayLabel = (date) =>
  date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();

export const shortDate = (date) =>
  date.toLocaleDateString("en-US", { day: "numeric", month: "short" });

export const longDate = (date) =>
  date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
