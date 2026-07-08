
export default function CategoryTabs({ categories, activeTab, onTabChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((tab) => {
        const isTabActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all cursor-pointer focus:outline-none
              ${
                isTabActive
                  ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/10 scale-105"
                  : "bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
