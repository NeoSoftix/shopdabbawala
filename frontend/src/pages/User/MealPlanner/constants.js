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

// True when the given date is today or earlier - meals must be scheduled at
// least 1 day in advance (mirrors the backend's `requestDate <= today` check
// in mealSchedule.controller.js::createMealSchedule), so today itself is too
// late for a vendor to prepare/deliver, same as a genuinely past date.
export const isTooLateToSchedule = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate <= today;
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
// schedule meals for: at least 1 day out, and within the plan's validity.
export const isSelectableDate = (date, subscription) =>
  !isTooLateToSchedule(date) && !isBeyondSubscription(date, subscription);

// The Monday (00:00) of the calendar week containing `date`.
export const mondayOf = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0 = Sunday .. 6 = Saturday
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diff);
  return d;
};

// The "current active week" the user is allowed to schedule meals within:
// starts the day after the subscription began (the start day itself was
// covered by checkout) through that calendar week's Sunday - then every
// following Monday..Sunday week, rolling forward as today moves past the
// current window's Sunday. Clamped by the subscription's endDate. Mirrors
// backend/src/utils/getActiveWeekWindow.js exactly (server re-validates the
// same window on submit) - keep the two in sync if this logic changes.
export const getActiveWeekRange = (subscription, maxWeeklyMenuDate = null) => {
  if (!subscription?.startDate) return [];

  const subStart = new Date(subscription.startDate);
  subStart.setHours(0, 0, 0, 0);

  const subEnd = subscription.endDate ? new Date(subscription.endDate) : null;
  if (subEnd) subEnd.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstSchedulable = new Date(subStart);
  firstSchedulable.setDate(firstSchedulable.getDate() + 1);

  const firstMonday = mondayOf(firstSchedulable);
  const firstSunday = new Date(firstMonday);
  firstSunday.setDate(firstSunday.getDate() + 6);

  let windowStart = firstSchedulable;
  let windowEnd = firstSunday;

  if (today > firstSunday) {
    windowStart = mondayOf(today);
    windowEnd = new Date(windowStart);
    windowEnd.setDate(windowEnd.getDate() + 6);
  }

  // Extend the window to the furthest date populated in the weekly menu (if provided)
  if (maxWeeklyMenuDate) {
    const maxDate = new Date(maxWeeklyMenuDate);
    maxDate.setHours(0, 0, 0, 0);
    if (maxDate > windowEnd) {
      windowEnd = maxDate;
    }
  }

  if (subEnd && windowEnd > subEnd) windowEnd = subEnd;

  const dates = [];
  const cur = new Date(windowStart);
  while (cur <= windowEnd) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

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
