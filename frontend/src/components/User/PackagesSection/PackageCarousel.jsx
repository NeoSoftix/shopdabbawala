import PackageCard from "./PackageCard";
import { getResponsiveOffset, isCurrentPlan } from "./packageUtils";

// The interactive drag/click carousel: prev/next arrows plus the stack of
// PackageCard instances, positioned relative to the currently active index.
export default function PackageCarousel({
  packages,
  active,
  setActive,
  activeSubscriptions,
  onNext,
  onPrev,
  onOpenFeatures,
  onChoosePlan,
}) {
  const handleDragEnd = (event, info) => {
    if (info.offset.x < -50) {
      onNext();
    } else if (info.offset.x > 50) {
      onPrev();
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto z-10 flex items-center justify-between px-2 sm:px-6 my-auto overflow-visible">
      <button
        onClick={onPrev}
        className="hidden md:flex w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-800 font-black items-center justify-center shadow-lg hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 z-40 focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="relative h-[480px] sm:h-[510px] md:h-[550px] w-full flex items-center justify-center overflow-visible mx-2 md:mx-4">
        {packages.map((pkg, index) => {
          const isActive = index === active;
          const offsetWidth = getResponsiveOffset();
          let distance = index - active;

          // Carousel Bound Logic for infinite loop
          if (distance > 1 && active === 0 && index === packages.length - 1) {
            distance = -1;
          } else if (
            distance < -1 &&
            active === packages.length - 1 &&
            index === 0
          ) {
            distance = 1;
          }

          let xPosition = 0;
          let shouldRender = false;

          if (distance === 0) {
            xPosition = 0;
            shouldRender = true;
          } else if (distance === 1) {
            xPosition = offsetWidth;
            shouldRender = true;
          } else if (distance === -1) {
            xPosition = -offsetWidth;
            shouldRender = true;
          }

          // Agar active package 1 se zyaada door hai array me, toh skip render
          if (!shouldRender && packages.length > 2) return null;

          return (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              isActive={isActive}
              distance={distance}
              xPosition={xPosition}
              isCurrentPlan={isCurrentPlan(pkg, activeSubscriptions)}
              onSelect={() => setActive(index)}
              onDragEnd={handleDragEnd}
              onOpenFeatures={onOpenFeatures}
              onChoosePlan={onChoosePlan}
            />
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="hidden md:flex w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-800 font-black items-center justify-center shadow-lg hover:bg-red-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 z-40 focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
