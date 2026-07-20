import { AnimatePresence } from "framer-motion";

import AddOnCard from "./AddOnCard";

export default function AddOnsGrid({
  items,
  favorites,
  onToggleFavorite,
}) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <AddOnCard
            key={item._id}
            item={item}
            isFavorite={favorites[item._id]}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
