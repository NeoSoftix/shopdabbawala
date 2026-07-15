// The Monday (00:00 UTC) of the calendar week containing `date`. Uses UTC
// consistently (setUTCHours/getUTCDay/setUTCDate) - matching the rest of this
// controller - since "date" here is always a date-only value (YYYY-MM-DD)
// that JS parses as UTC midnight; mixing in local-time methods can shift the
// calendar day by ±1 depending on server timezone.
const mondayOf = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  const dow = d.getUTCDay(); // 0 = Sunday .. 6 = Saturday
  const diff = dow === 0 ? -6 : 1 - dow;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
};

// Computes the Mon-Sun week window a user is currently allowed to schedule
// meals within. The first window starts the day *after* the subscription
// began (the start day itself is covered by checkout, not re-schedulable)
// through that calendar week's Sunday; every window after that is a full
// Monday..Sunday week, rolling forward automatically as `referenceDate`
// (normally "today") moves past the current window's Sunday. Clamped by the
// subscription's own endDate so it never extends past plan validity.
export const getActiveWeekWindow = (subscription, referenceDate = new Date(), maxWeeklyMenuDate = null) => {
  const subStart = new Date(subscription.startDate);
  subStart.setUTCHours(0, 0, 0, 0);

  const subEnd = subscription.endDate ? new Date(subscription.endDate) : null;
  if (subEnd) subEnd.setUTCHours(0, 0, 0, 0);

  const today = new Date(referenceDate);
  today.setUTCHours(0, 0, 0, 0);

  const firstSchedulable = new Date(subStart);
  firstSchedulable.setUTCDate(firstSchedulable.getUTCDate() + 1);

  const firstMonday = mondayOf(firstSchedulable);
  const firstSunday = new Date(firstMonday);
  firstSunday.setUTCDate(firstSunday.getUTCDate() + 6);

  let windowStart = firstSchedulable;
  let windowEnd = firstSunday;

  if (today > firstSunday) {
    windowStart = mondayOf(today);
    windowEnd = new Date(windowStart);
    windowEnd.setUTCDate(windowEnd.getUTCDate() + 6);
  }

  // Extend the window to the furthest date populated in the weekly menu (if provided)
  if (maxWeeklyMenuDate) {
    const maxDate = new Date(maxWeeklyMenuDate);
    maxDate.setUTCHours(0, 0, 0, 0);
    if (maxDate > windowEnd) {
      windowEnd = maxDate;
    }
  }

  if (subEnd && windowEnd > subEnd) windowEnd = subEnd;

  return { windowStart, windowEnd };
};
