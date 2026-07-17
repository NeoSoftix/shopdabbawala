// Joins a user's separately-stored address fields (street line, city, state,
// pincode) into one display-ready string for Order.deliveryAddress - callers
// previously stored just the street line, which is why order details only
// ever showed a fragment like "huse 43" instead of the full address.
export const formatFullAddress = ({ address, city, state, pincode }) => {
  const line2 = [city, state].filter(Boolean).join(", ");
  const parts = [address, line2, pincode].filter(Boolean);
  return parts.join(" - ");
};
