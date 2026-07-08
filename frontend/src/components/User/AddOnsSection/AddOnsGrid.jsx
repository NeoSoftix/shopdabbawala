import { AnimatePresence } from "framer-motion";

import AddOnCard from "./AddOnCard";

export default function AddOnsGrid({
  items,
  cart,
  favorites,
  onToggleFavorite,
  onAdd,
  onQuantityChange,
}) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <AddOnCard
            key={item._id}
            item={item}
            qtyInCart={cart[item._id] || 0}
            isFavorite={favorites[item._id]}
            onToggleFavorite={onToggleFavorite}
            onAdd={onAdd}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
