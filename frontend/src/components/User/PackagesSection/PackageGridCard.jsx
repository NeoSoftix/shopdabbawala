import { DEFAULT_IMAGES } from "./packageUtils";

// A single package card inside the "View All Packages" grid modal.
export default function PackageGridCard({ pkg, isCurrentPlan, onChoose }) {
  return (
    <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      {pkg.popular && (
        <span className="absolute top-3 right-3 bg-red-600 text-white font-black text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full">
          Popular
        </span>
      )}

      {pkg.hasDiscount && (
        <span className="absolute top-3 left-3 bg-green-600 text-white font-black text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full">
          Discounted
        </span>
      )}

      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-inner border-2 border-white flex-shrink-0">
            <img
              src={pkg.image}
              alt={pkg.title}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = DEFAULT_IMAGES[0]; e.target.onerror = null; }}
            />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-base tracking-wide uppercase">
              {pkg.title}
            </h4>
            <p className="text-slate-400 font-bold text-[10px] uppercase mt-0.5">
              {pkg.meals}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-baseline gap-1.5">
          {pkg.hasDiscount && (
            <span className="text-sm font-bold text-slate-400 line-through">
              {pkg.originalPrice}
            </span>
          )}
          <span className="text-2xl font-black text-slate-900">
            {pkg.price}
          </span>
          <span className="text-slate-400 font-bold text-xs">
            /mo
          </span>
        </div>

        <ul className="space-y-1.5 mb-2">
          {pkg.features.slice(0, 4).map((feat) => (
            <li
              key={feat}
              className="flex items-center text-slate-600 text-xs font-semibold tracking-wide"
            >
              <div className="w-3.5 h-3.5 bg-red-500/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <svg
                  className="w-2 h-2 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="truncate">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        disabled={isCurrentPlan}
        onClick={onChoose}
        className={`w-full py-2.5 mt-4 rounded-xl font-black text-[11px] tracking-widest uppercase shadow-sm transition-all focus:outline-none ${isCurrentPlan ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
      >
        {isCurrentPlan ? "Current Plan" : "Choose Plan"}
      </button>
    </div>
  );
}
