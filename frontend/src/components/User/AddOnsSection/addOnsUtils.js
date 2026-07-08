// Small pure helpers shared by the AddOnsSection sub-components.

export const FALLBACK_ADDON_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";

export function filterAddOnsByTab(addonsData, activeTab) {
  return addonsData.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Recommended") return item.tag && item.tag !== "";
    return (
      item.category && item.category.toLowerCase() === activeTab.toLowerCase()
    );
  });
}

export function getCartItemsCount(cart) {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

export function getTotalCartAmount(cart, addonsData) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = addonsData.find((f) => f._id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

export function getCartItemNames(cart, addonsData) {
  return Object.entries(cart)
    .map(([id]) => addonsData.find((f) => f._id === id)?.name)
    .filter(Boolean)
    .join(", ");
}
